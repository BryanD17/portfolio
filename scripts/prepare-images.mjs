// Convert the owner headshot to WebP at 1x and 2x plus a square OG crop.
import sharp from "sharp";
import { existsSync } from "node:fs";

const src = "C:/Users/Owner/Downloads/Bryan 2.JPG";
if (!existsSync(src)) {
  console.error("BLOCKED: headshot not found at " + src);
  process.exit(1);
}

const img = sharp(src).rotate(); // respect EXIF orientation
const meta = await img.metadata();
console.log(`source: ${meta.width}x${meta.height} ${meta.format}`);

await sharp(src).rotate().resize(480).webp({ quality: 82 }).toFile("public/bryan-joseph.webp");
await sharp(src)
  .rotate()
  .resize(960, null, { withoutEnlargement: true })
  .webp({ quality: 80 })
  .toFile("public/bryan-joseph@2x.webp");
await sharp(src)
  .rotate()
  .resize(800, 800, { fit: "cover", position: "attention" })
  .webp({ quality: 80 })
  .toFile("public/bryan-joseph-square.webp");

for (const f of ["bryan-joseph.webp", "bryan-joseph@2x.webp", "bryan-joseph-square.webp"]) {
  const m = await sharp(`public/${f}`).metadata();
  const { size } = await import("node:fs").then((fs) => fs.statSync(`public/${f}`));
  console.log(`${f}: ${m.width}x${m.height}, ${(size / 1024).toFixed(1)} KB`);
}
