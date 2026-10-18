// Gera as fotos do site no tamanho em que aparecem na tela (WebP), a partir dos originais em ../raw.
import sharp from 'sharp'
import { readdirSync } from 'node:fs'

const widths = { 'cafe-rosa': 900, 'donuts-rosa': 900, confeiteira: 420 }
const used = readdirSync('public/images').map((f) => f.replace('.webp', ''))
let total = 0
for (const name of used) {
  const info = await sharp(`../raw/${name}.jpg`)
    .rotate()
    .resize({ width: widths[name] ?? 640, withoutEnlargement: true })
    .webp({ quality: 68, effort: 6, smartSubsample: true })
    .toFile(`public/images/${name}.webp`)
  total += info.size
  console.log(name.padEnd(18), info.width + 'x' + info.height, Math.round(info.size / 1024) + ' KB')
}
console.log('total', Math.round(total / 1024) + ' KB')
