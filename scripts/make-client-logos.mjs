// Turns the client logos supplied by the owner into single-colour marks (brand ink on transparent)
// so the logo strip matches the site theme. Sources live in scripts/data/client-logos/.
// usage: node scripts/make-client-logos.mjs
import sharp from "sharp";

const SRC = "scripts/data/client-logos";
const OUT = "public/clients";
const INK = [28, 28, 28]; // --color-ink-soft
const H = 112; // output height (displayed at ~28-40px, so 2-4x for retina)

const clamp = (v) => Math.max(0, Math.min(1, v));
// mode "dark": dark/coloured mark on a light background → ink where the pixel is far from white
const dark = (r, g, b) => clamp((255 - Math.min(r, g, b) - 30) / 140);
// mode "light": white mark on a coloured/grey background → ink where the pixel is near white
const light = (lo, hi) => (r, g, b) => clamp((Math.min(r, g, b) - lo) / (hi - lo));
// mode "warm": white-and-gold lettering on a deep-blue background → ink wherever the red channel is up (the blue background has almost none)
const warm = (r) => clamp((r - 75) / 40);

const logos = [
  { slug: "c-and-co", name: "C&Co", file: "strip.webp", crop: [40, 30, 212, 162], alpha: dark },
  { slug: "lelior", name: "Lèlior", file: "strip.webp", crop: [410, 67, 292, 84], alpha: dark },
  { slug: "calfo", name: "Calfo", file: "strip.webp", crop: [814, 80, 304, 60], alpha: dark },
  { slug: "r-stamp", name: "R", file: "strip.webp", crop: [1222, 29, 304, 164], alpha: dark },
  { slug: "venuti-mayoka", name: "Venuti Mayoka", file: "strip.webp", crop: [1647, 93, 277, 35], alpha: light(208, 248) },
  { slug: "drain", name: "Drain", file: "drain.png", crop: [0, 0, 272, 81], alpha: dark },
  { slug: "bia", name: "BIA", file: "bia.png", alpha: dark },
  { slug: "universal-studios-singapore", name: "Universal Studios Singapore", file: "universal-studios-singapore.png", crop: [30, 212, 840, 156], alpha: warm },
];

for (const l of logos) {
  let img = sharp(`${SRC}/${l.file}`).flatten({ background: "#ffffff" });
  if (l.crop) img = img.extract({ left: l.crop[0], top: l.crop[1], width: l.crop[2], height: l.crop[3] });
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  let x0 = info.width, y0 = info.height, x1 = 0, y1 = 0;
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      const a = l.alpha(data[i], data[i + 1], data[i + 2]);
      const o = (y * info.width + x) * 4;
      out[o] = INK[0]; out[o + 1] = INK[1]; out[o + 2] = INK[2]; out[o + 3] = Math.round(a * 255);
      if (a > 0.1) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    }
  const w = x1 - x0 + 1, h = y1 - y0 + 1;
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extract({ left: x0, top: y0, width: w, height: h })
    .resize({ height: H - 8, kernel: "lanczos3" })
    .extend({ top: 4, bottom: 4, left: 4, right: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }) // breathing room so no edge is ever clipped
    .png({ compressionLevel: 9, palette: true, quality: 95 })
    .toFile(`${OUT}/${l.slug}.png`);
  const m = await sharp(`${OUT}/${l.slug}.png`).metadata();
  console.log(l.slug.padEnd(28), `${m.width}x${m.height}`);
}
