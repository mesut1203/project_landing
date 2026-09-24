import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Start the seven independent Vite apps and a small local review index.
const root = dirname(fileURLToPath(import.meta.url))
const sites = [
  { folder: 'cafe_shop', name: 'Nâu Coffee', category: 'Coffee & slow moments', port: 5270, image: '/images/editorial/ritual.webp' },
  { folder: 'car_website', name: 'Apex Motors', category: 'The open road', port: 5271, image: '/media/apex-coast.webp' },
  { folder: 'education_web', name: 'Learn Forward', category: 'A place to keep learning', port: 5272, image: '/images/curiosity-library.webp' },
  { folder: 'hotel_web', name: 'Aurelia', category: 'Coastal hospitality', port: 5273, image: '/media/aurelia-pool.webp' },
  { folder: 'pizza_website', name: 'Fiamma', category: 'Wood-fired & whole-hearted', port: 5274, image: '/media/fiamma-pizza.webp' },
  { folder: 'residential_web', name: 'Luma Residences', category: 'Architecture for everyday life', port: 5275, image: '/images/desktop/luma-exterior.webp' },
  { folder: 'travel_website', name: 'Nomad', category: 'Journeys worth taking slowly', port: 5276, image: '/images/ha-giang-dawn.webp' },
]
const children = []
function startSite(site) {
  return new Promise((resolve, reject) => {
    let ready = false
    const child = spawn(process.execPath, [join(root, site.folder, 'node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--port', String(site.port), '--strictPort'], { cwd: join(root, site.folder), stdio: ['ignore', 'pipe', 'pipe'] })
    children.push(child)
    const timeout = setTimeout(() => reject(new Error(`${site.folder} did not start within 30 seconds.`)), 30000)
    child.stdout.on('data', data => {
      process.stdout.write(`[${site.folder}] ${data}`)
      if (!ready && data.toString().includes(`http://127.0.0.1:${site.port}/`)) {
        ready = true
        clearTimeout(timeout)
        resolve()
      }
    })
    child.stderr.on('data', data => process.stderr.write(`[${site.folder}] ${data}`))
    child.on('error', error => { clearTimeout(timeout); reject(error) })
    child.on('exit', code => {
      clearTimeout(timeout)
      if (stopping) { resolve(); return }
      const error = new Error(`${site.folder} stopped (exit ${code}). Check its dependencies and port ${site.port}.`)
      if (!ready) reject(error)
      else { console.error(error.message); stop(1) }
    })
  })
}

const projectCards = sites.map((site, index) => `
  <a class="project" data-reveal href="http://127.0.0.1:${site.port}/" target="_blank" rel="noopener">
    <div class="project-shell"><div class="project-core"><img src="/captures/${site.folder}.webp" alt="${site.name} website preview" loading="lazy" width="1440" height="1000"></div></div>
    <div class="project-caption"><div><span class="project-name">${site.name}</span><span class="project-info"><span class="project-number">0${index + 1}</span> ${site.category}</span></div><span class="project-arrow" aria-hidden="true">↗</span></div>
  </a>`).join('')
const server = createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://127.0.0.1:5279').pathname
    if (pathname === '/' || pathname === '/index.html') {
      const template = await readFile(join(root, 'preview.html'), 'utf8')
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' })
      res.end(template.replace('{{PROJECTS}}', projectCards))
      return
    }
    const site = sites.find(item => pathname === `/captures/${item.folder}.webp`)
    if (site) {
      const capture = await readFile(join(root, '.preview', `${site.folder}.webp`))
      res.writeHead(200, { 'Content-Type': 'image/webp', 'Cache-Control': 'no-cache' })
      res.end(capture)
      return
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Page not found. Return to /')
  } catch (error) {
    console.error(error.message)
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('The preview could not be loaded. Check the terminal for details.')
  }
})
let stopping = false
function stop(exitCode = 0) {
  if (stopping) return
  stopping = true
  process.exitCode = exitCode
  children.forEach(child => child.kill('SIGTERM'))
  if (server.listening) server.close()
}
server.on('error', error => { console.error(error.message); stop(1) })
process.on('SIGINT', () => stop())
process.on('SIGTERM', () => stop())

try {
  await Promise.all(sites.map(startSite))
  if (!stopping) server.listen(5279, '127.0.0.1', () => console.log('\nDesign review: http://127.0.0.1:5279/\n'))
} catch (error) {
  console.error(error.message)
  stop(1)
}
