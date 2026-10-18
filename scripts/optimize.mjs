// Converte as fotos de ../raw para WebP em public/images e gera uma folha de contato.
import sharp from "sharp";
import { readdirSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const [rawDir, outDir, sheet] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const files = readdirSync(rawDir).filter((f) => f.endsWith(".jpg"));
const thumbs = [];
for (const f of files) {
  const name = f.replace(".jpg", "");
  const img = sharp(join(rawDir, f)).rotate();
  const meta = await img.metadata();
  await img.clone().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 74 }).toFile(join(outDir, `${name}.webp`));
  console.log(name, meta.width, meta.height);
  thumbs.push(await sharp(join(rawDir, f)).resize(240, 240, { fit: "cover" }).toBuffer());
}
if (sheet) {
  const cols = 6;
  const rows = Math.ceil(thumbs.length / cols);
  await sharp({ create: { width: cols * 240, height: rows * 240, channels: 3, background: "#fff" } })
    .composite(thumbs.map((input, i) => ({ input, left: (i % cols) * 240, top: Math.floor(i / cols) * 240 })))
    .jpeg({ quality: 70 })
    .toFile(sheet);
}
