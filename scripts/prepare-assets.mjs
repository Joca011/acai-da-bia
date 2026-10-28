// Pipeline de assets: raw/ -> public/assets/
// Uso: npm run assets            (processa o que existir em raw/)
//      npm run assets -- --placeholders   (gera placeholders para o que faltar)
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = path.join(ROOT, 'raw');
const OUT = path.join(ROOT, 'public/assets');
const MARK = path.join(OUT, '.placeholders.json'); // controla o que e placeholder
const FFMPEG = fs.existsSync('/usr/local/bin/ffmpeg') ? '/usr/local/bin/ffmpeg' : 'ffmpeg';
const WITH_PLACEHOLDERS = process.argv.includes('--placeholders');

const IMG_EXT = ['png', 'jpg', 'jpeg', 'webp'];
const findRaw = (base, exts = IMG_EXT) => {
  for (const e of exts) {
    for (const x of [e, e.toUpperCase()]) {
      const p = path.join(RAW, `${base}.${x}`);
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
};

/* ------------------------------------------------------------------ */
/* White keying                                                        */
/* ------------------------------------------------------------------ */
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Remove o fundo branco conectado as bordas da imagem.
 * data: RGBA (Uint8) w x h. Retorna novo buffer RGBA.
 * - mascara "quase-branco/cinza claro de baixa saturacao" (inclui sombras suaves)
 * - flood fill a partir das bordas: so o que esta conectado ao fundo some
 *   (brilhos brancos DENTRO do sujeito permanecem)
 * - borda suavizada (feather) + descontaminacao de cor contra o branco
 */
export function keyWhite(data, w, h, opts = {}) {
  const { whiteHi = 246, whiteLo = 225, bgMin = 178, bgSat = 20, band = 2 } = opts;
  const n = w * h;
  const minC = new Uint8Array(n);
  const near = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    const mn = Math.min(r, g, b), mx = Math.max(r, g, b);
    minC[i] = mn;
    // quase-branco (limiar mais permissivo na saturacao) ou cinza claro (sombra)
    near[i] = mn >= bgMin && mx - mn <= bgSat ? 1 : 0;
  }
  // flood fill (4-conectado) a partir das bordas
  const bg = new Uint8Array(n);
  const stack = new Int32Array(n);
  let sp = 0;
  const push = (i) => { if (near[i] && !bg[i]) { bg[i] = 1; stack[sp++] = i; } };
  for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
  while (sp) {
    const i = stack[--sp];
    const x = i % w;
    if (x > 0) push(i - 1);
    if (x < w - 1) push(i + 1);
    if (i >= w) push(i - w);
    if (i < n - w) push(i + w);
  }
  // banda ao redor do fundo (dilatacao Chebyshev)
  let cur = bg;
  for (let s = 0; s < band; s++) {
    const nxt = new Uint8Array(cur);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (cur[i]) continue;
        let hit = 0;
        for (let dy = -1; dy <= 1 && !hit; dy++) {
          const yy = y + dy; if (yy < 0 || yy >= h) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx; if (xx < 0 || xx >= w) continue;
            if (cur[yy * w + xx]) { hit = 1; break; }
          }
        }
        if (hit) nxt[i] = 1;
      }
    }
    cur = nxt;
  }
  const inBand = cur;
  // alfa bruto
  const a = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    if (bg[i]) a[i] = 0;
    else if (inBand[i]) a[i] = 1 - smooth(whiteLo, whiteHi, minC[i]);
    else a[i] = 1;
  }
  // feather: blur 3x3 so nos pixels da banda (nao-fundo)
  const af = new Float32Array(a);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (bg[i] || !inBand[i]) continue;
      let sum = 0, c = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const yy = y + dy; if (yy < 0 || yy >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx; if (xx < 0 || xx >= w) continue;
          sum += a[yy * w + xx]; c++;
        }
      }
      af[i] = Math.min(a[i], sum / c);
    }
  }
  // saida + descontaminacao: c = (c - 255(1-a)) / a
  const out = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    let al = af[i];
    if (al < 0.03) al = 0;
    if (al >= 0.999) al = 1;
    if (al > 0 && al < 1) {
      for (let k = 0; k < 3; k++) {
        const v = (data[i * 4 + k] - 255 * (1 - al)) / al;
        out[i * 4 + k] = Math.max(0, Math.min(255, Math.round(v)));
      }
    } else {
      out[i * 4] = data[i * 4]; out[i * 4 + 1] = data[i * 4 + 1]; out[i * 4 + 2] = data[i * 4 + 2];
    }
    out[i * 4 + 3] = Math.round(al * 255);
  }
  return out;
}

async function keyedWebp(srcPath, dest, { maxWidth, quality }) {
  const { data, info } = await sharp(srcPath)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const keyed = keyWhite(data, info.width, info.height);
  await sharp(keyed, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality, alphaQuality: 90, effort: 5 })
    .toFile(dest);
}

const photoWebp = (src, dest, { maxWidth, quality }) =>
  sharp(src).rotate().resize({ width: maxWidth, withoutEnlargement: true }).webp({ quality, effort: 5 }).toFile(dest);

/* ------------------------------------------------------------------ */
/* ffmpeg                                                              */
/* ------------------------------------------------------------------ */
const ff = (args) => {
  const r = spawnSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`ffmpeg: ${r.stderr || r.error}`);
};

function encodeVideo(src, dest, { audio, maxBytes = 4 * 1024 * 1024 }) {
  const widths = [1920, 1280];
  for (const wMax of widths) {
    for (let crf = 28; crf <= 40; crf += 2) {
      ff([
        '-i', src,
        '-vf', `scale='min(${wMax},iw)':-2`,
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', String(crf), '-pix_fmt', 'yuv420p',
        ...(audio ? ['-c:a', 'aac', '-b:a', '96k'] : ['-an']),
        '-movflags', '+faststart', dest,
      ]);
      if (fs.statSync(dest).size < maxBytes) return `crf ${crf}, <=${wMax}px`;
    }
  }
  return 'AVISO: acima de 4 MB mesmo com CRF 40 / 1280px';
}

function frameFromVideo(src, dest, seconds, maxWidth, quality) {
  const tmp = dest + '.tmp.png';
  ff(['-ss', String(seconds), '-i', src, '-frames:v', '1', tmp]);
  return sharp(tmp).resize({ width: maxWidth, withoutEnlargement: true }).webp({ quality, effort: 5 }).toFile(dest)
    .finally(() => fs.rmSync(tmp, { force: true }));
}

/* ------------------------------------------------------------------ */
/* Placeholders                                                        */
/* ------------------------------------------------------------------ */
const rnd = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

async function placeholderLayer(dest, { width, height, seed }) {
  const r = rnd(seed);
  const cols = ['#6B0F32', '#8E3B7A', '#4A0A22', '#E1786E'];
  let c = '';
  for (let i = 0; i < 9; i++) {
    const rad = 40 + r() * 110;
    c += `<circle cx="${r() * width}" cy="${r() * height}" r="${rad}" fill="${cols[i % cols.length]}" opacity="${0.18 + r() * 0.22}" filter="url(#b)"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><filter id="b"><feGaussianBlur stdDeviation="14"/></filter></defs>${c}</svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 70, alphaQuality: 80 }).toFile(dest);
}

async function placeholderPhoto(dest, { width, height, label }) {
  const fs_ = Math.round(width / 28);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4A0A22"/><stop offset="0.55" stop-color="#6B0F32"/><stop offset="1" stop-color="#8E3B7A"/></linearGradient>
<radialGradient id="r" cx="0.7" cy="0.3" r="0.6"><stop offset="0" stop-color="#E1786E" stop-opacity="0.35"/><stop offset="1" stop-color="#E1786E" stop-opacity="0"/></radialGradient></defs>
<rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" fill="url(#r)"/>
<text x="${width / 2}" y="${height - fs_ * 1.6}" text-anchor="middle" font-family="sans-serif" font-size="${fs_}" fill="#FBF6EA" fill-opacity="0.45">placeholder: ${label}</text></svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 75 }).toFile(dest);
}

function placeholderVideo(dest, { width = 1280, height = 720 } = {}) {
  const base = ['-f', 'lavfi'];
  const enc = ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '30', '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart', dest];
  try {
    ff([...base, '-i', `gradients=s=${width}x${height}:c0=0x4A0A22:c1=0x8E3B7A:x0=0:y0=0:x1=${width}:y1=${height}:speed=0.02:d=4:r=24`, '-t', '4', ...enc]);
  } catch {
    ff([...base, '-i', `color=c=0x6B0F32:s=${width}x${height}:d=4:r=24`, '-t', '4', ...enc]);
  }
}

/* ------------------------------------------------------------------ */
/* Manifesto                                                           */
/* ------------------------------------------------------------------ */
const PRODUCTS = ['classico', 'morango', 'chocolate-avela', 'pacoca', 'gourmet-tropical', 'gourmet-chocolate-ouro'];

const jobs = [
  { out: 'bg-forest.webp', raw: 'bg-forest', kind: 'photo', maxWidth: 2400, quality: 78, ph: { width: 1600, height: 900 } },
  { out: 'mid-layer.webp', raw: 'mid-layer', kind: 'key', maxWidth: 2400, quality: 82, ph: { width: 1600, height: 900, seed: 11 } },
  { out: 'hero-bowl.webp', raw: 'hero-bowl', kind: 'key', maxWidth: 1400, quality: 82, ph: { width: 1000, height: 1000, seed: 23 } },
  { out: 'fg-splash.webp', raw: 'fg-splash', kind: 'key', maxWidth: 2400, quality: 82, ph: { width: 1600, height: 900, seed: 37 } },
  { out: 'hero-poster.webp', kind: 'poster', maxWidth: 1920, quality: 80, ph: { width: 1600, height: 900 } },
  { out: 'hero-loop.mp4', raw: 'hero-loop', kind: 'video', audio: false },
  { out: 'origem-video.mp4', raw: 'origem-video', kind: 'video', audio: true },
  { out: 'origem-poster.webp', kind: 'origem-poster', maxWidth: 1600, quality: 78, ph: { width: 1280, height: 720 } },
  { out: 'origem.webp', raw: 'origem', kind: 'photo', maxWidth: 1400, quality: 80, ph: { width: 1000, height: 1250 } },
  { out: 'loja.webp', raw: 'loja', kind: 'photo', maxWidth: 2000, quality: 80, ph: { width: 1600, height: 1000 } },
  ...PRODUCTS.map((p) => ({ out: `produtos/${p}.webp`, raw: p, kind: 'photo', maxWidth: 1000, quality: 80, ph: { width: 800, height: 800 } })),
];

const readMarks = () => { try { return new Set(JSON.parse(fs.readFileSync(MARK, 'utf8'))); } catch { return new Set(); } };

async function main() {
  fs.mkdirSync(path.join(OUT, 'produtos'), { recursive: true });
  const marks = readMarks();
  const rows = [];
  const heroVideo = findRaw('hero-loop', ['mp4', 'MP4']);
  const origemVideo = findRaw('origem-video', ['mp4', 'MP4']);

  for (const j of jobs) {
    const dest = path.join(OUT, j.out);
    let src = null;
    let note = '';
    try {
      if (j.kind === 'poster') src = findRaw('hero-frame') || heroVideo;
      else if (j.kind === 'origem-poster') src = origemVideo;
      else src = findRaw(j.raw, j.kind === 'video' ? ['mp4', 'MP4'] : IMG_EXT);

      if (src) {
        if (j.kind === 'key') await keyedWebp(src, dest, j), (note = 'keyed');
        else if (j.kind === 'photo') await photoWebp(src, dest, j), (note = 'ok');
        else if (j.kind === 'poster') {
          if (/\.mp4$/i.test(src)) { await frameFromVideo(src, dest, 0, j.maxWidth, j.quality); note = 'frame 0 do video'; }
          else { await photoWebp(src, dest, j); note = 'ok'; }
        } else if (j.kind === 'origem-poster') { await frameFromVideo(src, dest, 1, j.maxWidth, j.quality); note = 'frame 1s'; }
        else if (j.kind === 'video') note = encodeVideo(src, dest, j);
        marks.delete(j.out);
      } else if (WITH_PLACEHOLDERS && (!fs.existsSync(dest) || marks.has(j.out))) {
        if (j.kind === 'key') await placeholderLayer(dest, j.ph);
        else if (j.kind === 'video') placeholderVideo(dest);
        else await placeholderPhoto(dest, { ...j.ph, label: path.basename(j.out, '.webp').replace(/^hero-/, 'hero ') });
        marks.add(j.out);
        note = 'PLACEHOLDER';
      } else if (fs.existsSync(dest)) {
        note = marks.has(j.out) ? 'placeholder mantido' : 'saida existente mantida (sem raw)';
      } else {
        note = 'AUSENTE';
        console.warn(`! sem origem para ${j.out} (esperado: raw/${j.raw ?? (j.kind === 'poster' ? 'hero-frame.* ou raw/hero-loop.mp4' : 'origem-video.mp4')})`);
      }
    } catch (e) {
      note = 'ERRO: ' + e.message;
      console.error(`x ${j.out}: ${e.message}`);
    }
    const size = fs.existsSync(dest) ? fs.statSync(dest).size : 0;
    rows.push([j.out, size ? (size / 1024).toFixed(0) + ' KB' : '-', note]);
  }
  fs.writeFileSync(MARK, JSON.stringify([...marks].sort(), null, 2));

  const w0 = Math.max(...rows.map((r) => r[0].length));
  console.log('\n' + 'arquivo'.padEnd(w0) + '  tamanho    obs');
  for (const [a, b, c] of rows) console.log(a.padEnd(w0) + '  ' + b.padEnd(9) + '  ' + c);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
