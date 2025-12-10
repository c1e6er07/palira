import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const root = process.cwd()
const svgPath = path.join(root, 'src', 'app', 'icon.svg')
const outDir = path.join(root, 'src', 'app')

async function ensureSvg() {
  const exists = fs.existsSync(svgPath)
  if (!exists) throw new Error(`icon.svg não encontrado em ${svgPath}`)
}

async function renderPngSizes() {
  const sizes = [16, 32, 48, 64]
  const buffers = []
  for (const s of sizes) {
    const buf = await sharp(svgPath).resize(s, s).png().toBuffer()
    const tmp = path.join(outDir, `favicon-${s}.png`)
    await fs.promises.writeFile(tmp, buf)
    buffers.push({ size: s, path: tmp })
  }
  return buffers
}

async function createIco(pngs) {
  const icoBuf = await pngToIco(pngs.map(p => p.path))
  const icoPath = path.join(outDir, 'favicon.ico')
  await fs.promises.writeFile(icoPath, icoBuf)
  return icoPath
}

async function cleanup(pngs) {
  await Promise.all(pngs.map(p => fs.promises.unlink(p.path).catch(() => {})))
}

async function main() {
  await ensureSvg()
  const pngs = await renderPngSizes()
  const icoPath = await createIco(pngs)
  await cleanup(pngs)
  console.log(`Favicon gerado: ${icoPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

