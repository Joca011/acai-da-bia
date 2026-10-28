// Gera o logotipo "Açaí da Bia" em SVG vetorial (paths) a partir do Fraunces.
// Uso: npm run logo
import * as ot from 'opentype.js/dist/opentype.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fontDir = path.join(root, 'node_modules/@fontsource/fraunces/files');
const load = (w) => {
  const b = fs.readFileSync(path.join(fontDir, `fraunces-latin-${w}-normal.woff`));
  return ot.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};
const black = load(900);
const semi = load(600);

const r2 = (n) => Math.round(n * 100) / 100;

// ---- "Bia" com ı sem pingo ----
const SIZE = 1000;
const scale = SIZE / black.unitsPerEm;
const glyphs = black.stringToGlyphs('Bıa');
let x = 0;
const bia = new ot.Path();
const pos = [];
glyphs.forEach((g, i) => {
  const p = g.getPath(x, 0, SIZE);
  bia.extend(p);
  pos.push({ x, g });
  let adv = g.advanceWidth * scale;
  if (i < glyphs.length - 1) adv += black.getKerningValue(g, glyphs[i + 1]) * scale;
  x += adv;
});
const biaBox = bia.getBoundingBox();

// geometria do pingo original (contorno mais alto do glifo "i")
const iGlyph = black.charToGlyph('i');
const iPath = iGlyph.getPath(0, 0, SIZE);
const contours = [];
let cur = null;
for (const c of iPath.commands) {
  if (c.type === 'M') { cur = []; contours.push(cur); }
  cur.push(c);
}
const bb = (cmds) => {
  const p = new ot.Path(); p.commands = cmds; return p.getBoundingBox();
};
const dot = contours.map(bb).sort((a, b) => a.y1 - b.y1)[0];
const dotR = (dot.x2 - dot.x1) / 2;
const dotCx = (dot.x1 + dot.x2) / 2;
const dotCy = (dot.y1 + dot.y2) / 2;
const iX = pos[1].x;

// baga de açaí: maior que o pingo, deslocada para cima e para a direita
const berryR = dotR * 1.12;
const berryCx = iX + dotCx + dotR * 0.3;
const berryCy = dotCy - dotR * 0.22;

// folhinha pontuda no topo da baga, girada -30°
const L = berryR * 1.0, W = berryR * 0.36;
const leafD = `M0 0C${r2(L * .25)} ${r2(-W * 1.6)} ${r2(L * .72)} ${r2(-W * 1.15)} ${r2(L)} 0C${r2(L * .72)} ${r2(W * 1.15)} ${r2(L * .25)} ${r2(W * 1.6)} 0 0Z`;
const leafX = berryCx + berryR * 0.12, leafY = berryCy - berryR * 0.9;
const leafTransform = `translate(${r2(leafX)} ${r2(leafY)}) rotate(-30)`;

// ---- linha superior "AÇAÍ DA" espaçada ----
const TOP_SIZE = 150;
const tScale = TOP_SIZE / semi.unitsPerEm;
const tracking = 0.3 * TOP_SIZE;
const tg = semi.stringToGlyphs('AÇAÍ DA');
const top = new ot.Path();
let tx = 0;
tg.forEach((g, i) => {
  top.extend(g.getPath(tx, 0, TOP_SIZE));
  tx += g.advanceWidth * tScale + (i < tg.length - 1 ? tracking : 0);
});
const topBox = top.getBoundingBox();
const topW = topBox.x2 - topBox.x1;
const biaW = biaBox.x2 - biaBox.x1;
const GAP = 60;
const leafTopY = berryCy - berryR - L * 0.75;
// centraliza a linha superior sobre "Bia" e a coloca acima da altura-de-cap do B
const topDx = (biaBox.x1 + biaW / 2) - (topBox.x1 + topW / 2);
const topDy = Math.min(biaBox.y1, leafTopY) - GAP - topBox.y2;

const topD = new ot.Path();
topD.commands = top.commands.map((c) => {
  const o = { ...c };
  for (const k of ['x', 'x1', 'x2']) if (k in o) o[k] += topDx;
  for (const k of ['y', 'y1', 'y2']) if (k in o) o[k] += topDy;
  return o;
});

// viewBox justo
const pad = 14;
const minX = Math.min(biaBox.x1, topBox.x1 + topDx) - pad;
const maxX = Math.max(biaBox.x2, topBox.x2 + topDx) + pad;
const minY = Math.min(topBox.y1 + topDy, berryCy - berryR - L * 0.7) - pad;
const maxY = biaBox.y2 + pad;
const vb = `${r2(minX)} ${r2(minY)} ${r2(maxX - minX)} ${r2(maxY - minY)}`;

const biaD = bia.toPathData(2);
const topPD = topD.toPathData(2);

const logo = (color) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="Açaí da Bia" fill="${color}">
<path d="${topPD}"/>
<path d="${biaD}"/>
<circle cx="${r2(berryCx)}" cy="${r2(berryCy)}" r="${r2(berryR)}"/>
<path transform="${leafTransform}" d="${leafD}"/>
</svg>
`;

const out = path.join(root, 'public/assets');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'logo-bia.svg'), logo('#6B0F32'));
fs.writeFileSync(path.join(out, 'logo-bia-creme.svg'), logo('#FBF6EA'));

// ---- favicon: "B" com a baga no lugar de um pingo ----
const bGlyph = black.charToGlyph('B');
const FS = 600;
const bp = bGlyph.getPath(0, 0, FS);
const bbx = bp.getBoundingBox();
const bw = bbx.x2 - bbx.x1, bh = bbx.y2 - bbx.y1;
const target = 34; // altura do B dentro do quadrado de 64
const k = target / bh;
const bx = 32 - (bw * k) / 2 - bbx.x1 * k - 1;
const by = 42 + (bh * k) / 2 - bbx.y2 * k;
const fr = 6.2;
const fcx = 46, fcy = 14.5;
const fl = 7.5, fw = 2.6;
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Açaí da Bia">
<rect width="64" height="64" rx="16" fill="#F7DEB6"/>
<g fill="#6B0F32">
<path transform="translate(${r2(bx)} ${r2(by)}) scale(${r2(k)})" d="${bp.toPathData(2)}"/>
<circle cx="${fcx}" cy="${fcy}" r="${fr}"/>
<path transform="translate(${fcx + 0.8} ${r2(fcy - fr * 0.9)}) rotate(-30)" d="M0 0C${r2(fl * .25)} ${-fw} ${r2(fl * .72)} ${r2(-fw * .75)} ${fl} 0C${r2(fl * .72)} ${r2(fw * .75)} ${r2(fl * .25)} ${fw} 0 0Z"/>
</g>
</svg>
`;
fs.writeFileSync(path.join(root, 'public/favicon.svg'), favicon);
console.log('Logo gerado:', ['public/assets/logo-bia.svg', 'public/assets/logo-bia-creme.svg', 'public/favicon.svg'].join(', '), '| viewBox', vb);
