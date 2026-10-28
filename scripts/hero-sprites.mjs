// Gera sprites do hero: bowl com máscara circular e frutas/folhas separadas do mid-layer.
import sharp from 'sharp';
import fs from 'node:fs';
const OUT = 'public/assets/hero';
fs.mkdirSync(OUT, { recursive: true });

// 1) Bowl: recorte circular (vista de cima)
{
  const { data, info } = await sharp('raw/hero-bowl.jpg').raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const far = (i) => { const r = data[i], g = data[i + 1], b = data[i + 2]; return 255 * 3 - (r + g + b) > 90; };
  let top = H, L = W, R = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (far((y * W + x) * C)) { if (y < top) top = y; }
  const yMid = top + Math.round(W * 0.35);
  for (let y = top; y < yMid; y++) for (let x = 0; x < W; x++) if (far((y * W + x) * C)) { if (x < L) L = x; if (x > R) R = x; }
  const r = (R - L) / 2, cx = (L + R) / 2, cy = top + r;
  const svg = `<svg width="${W}" height="${H}"><circle cx="${cx}" cy="${cy}" r="${r - 2}" fill="#fff"/></svg>`;
  const masked = await sharp('raw/hero-bowl.jpg').composite([{ input: Buffer.from(svg), blend: 'dest-in' }]).png().toBuffer();
  await sharp(masked)
    .extract({ left: Math.round(cx - r), top: Math.round(cy - r), width: Math.round(2 * r), height: Math.round(2 * r) })
    .resize(1100).webp({ quality: 84 }).toFile(`${OUT}/bowl.webp`);
  console.log('bowl', { cx, cy, r });
}

// 2) Sprites: componentes conectados do mid-layer já recortado
{
  const { data, info } = await sharp('public/assets/mid-layer.webp').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const seen = new Uint8Array(W * H);
  const comps = [];
  for (let s = 0; s < W * H; s++) {
    if (seen[s] || data[s * 4 + 3] < 128) continue;
    const st = [s]; seen[s] = 1; let n = 0, x0 = W, y0 = H, x1 = 0, y1 = 0;
    while (st.length) {
      const p = st.pop(); n++; const x = p % W, y = (p / W) | 0;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      for (const q of [p - 1, p + 1, p - W, p + W]) if (q >= 0 && q < W * H && !seen[q] && data[q * 4 + 3] >= 128) { seen[q] = 1; st.push(q); }
    }
    const edge = x0 <= 2 || y0 <= 2 || x1 >= W - 3 || y1 >= H - 3;
    if (n > 1500 && !edge && x1 - x0 < W * 0.4) comps.push({ x0, y0, x1, y1, n });
  }
  comps.sort((a, b) => b.n - a.n);
  const manifest = [];
  let i = 0;
  for (const c of comps.slice(0, 14)) {
    const pad = 6, left = Math.max(0, c.x0 - pad), top = Math.max(0, c.y0 - pad);
    const w = Math.min(W - left, c.x1 - c.x0 + 2 * pad), h = Math.min(H - top, c.y1 - c.y0 + 2 * pad);
    const f = `s${i++}.webp`;
    await sharp('public/assets/mid-layer.webp').extract({ left, top, width: w, height: h }).webp({ quality: 82 }).toFile(`${OUT}/${f}`);
    manifest.push({ f, w, h, cx: (left + w / 2) / W, cy: (top + h / 2) / H });
  }
  fs.writeFileSync('src/lib/heroSprites.json', JSON.stringify(manifest, null, 1));
  console.log(manifest.length, 'sprites');
}
