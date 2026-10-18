// Gera public/og-image.jpg (1200x630) com a foto de donuts e o nome da confeitaria.
import sharp from 'sharp'

const photo = await sharp('public/images/donuts-rosa.webp').resize(520, 520, { fit: 'cover' }).toBuffer()
const mask = Buffer.from('<svg width="520" height="520"><rect width="520" height="520" rx="120" fill="#fff"/></svg>')
const rounded = await sharp(photo).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()

const text = Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs><radialGradient id="g" cx="80%" cy="20%" r="1"><stop offset="0" stop-color="#bff0ec"/><stop offset=".5" stop-color="#8edfd9"/><stop offset="1" stop-color="#5fcac3"/></radialGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <path d="M0 560 C 120 540 160 600 240 570 S 380 520 460 575 S 640 610 720 560 S 900 530 980 580 S 1120 600 1200 560 V630 H0Z" fill="#f2709c"/>
  <text x="70" y="150" font-family="Arial, sans-serif" font-weight="700" font-size="17" letter-spacing="3" fill="#23303b">CONFEITARIA ARTESANAL · DESDE 2012</text>
  <text x="66" y="265" font-family="Arial Rounded MT Bold, Arial, sans-serif" font-weight="800" font-size="92" fill="#23303b">Doce</text>
  <text x="66" y="365" font-family="Arial Rounded MT Bold, Arial, sans-serif" font-weight="800" font-size="92" fill="#b8285a">Aurora</text>
  <text x="70" y="440" font-family="Arial, sans-serif" font-size="30" fill="#23303b">Doces que derretem corações</text>
</svg>`)

await sharp(text)
  .composite([{ input: rounded, left: 620, top: 40 }])
  .jpeg({ quality: 84 })
  .toFile('public/og-image.jpg')
console.log('og-image.jpg ok')
