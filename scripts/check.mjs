import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync, spawnSync } from 'node:child_process'

const selfPath = fileURLToPath(import.meta.url)

const readRegistryProxy = () => {
  try {
    const output = execFileSync(
      'reg',
      ['query', 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings'],
      { encoding: 'utf8' }
    )
    const values = {}
    for (const line of output.split(/\r?\n/)) {
      const match = line.match(/^\s*(\S+)\s+REG_\w+\s*(.*)$/)
      if (match) values[match[1]] = match[2].trim()
    }
    if ((values.ProxyEnable || '').toLowerCase() !== '0x1') return null
    const server = values.ProxyServer || ''
    if (!server) return null
    let url = ''
    if (server.includes('=')) {
      const entries = {}
      for (const part of server.split(';')) {
        const [scheme, address] = part.split('=')
        if (scheme && address) entries[scheme.trim().toLowerCase()] = address.trim()
      }
      url = entries.https || entries.http || ''
      if (!url) {
        if (entries.socks) console.log('[proxy] 仅检测到 socks 代理，Node 不支持，使用直连')
        return null
      }
    } else {
      url = server.trim()
    }
    if (!/^https?:\/\//i.test(url)) url = `http://${url}`
    const noProxy = (values.ProxyOverride || '')
      .split(';')
      .map(item => item.trim())
      .filter(item => item && item.toLowerCase() !== '<local>')
      .join(',')
    return { url, noProxy, source: '系统代理' }
  } catch {
    return null
  }
}

const detectProxy = () => {
  const envUrl =
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy
  if (envUrl) {
    return {
      url: envUrl,
      noProxy: process.env.NO_PROXY || process.env.no_proxy || '',
      source: '环境变量'
    }
  }
  if (process.platform === 'win32') return readRegistryProxy()
  return null
}

if (!process.env.UUZ_CHECK_PROXY_CHILD) {
  const proxy = detectProxy()
  if (proxy) {
    console.log(`[proxy] ${proxy.url} (${proxy.source})`)
    const env = {
      ...process.env,
      UUZ_CHECK_PROXY_CHILD: '1',
      HTTP_PROXY: proxy.url,
      HTTPS_PROXY: proxy.url
    }
    if (proxy.noProxy) env.NO_PROXY = proxy.noProxy
    const result = spawnSync(process.execPath, ['--use-env-proxy', selfPath], { stdio: 'inherit', env })
    process.exit(result.status ?? 1)
  }
}

const dataPath = resolve(dirname(selfPath), '../src/data/nav-data.json')
const { navLinks } = JSON.parse(readFileSync(dataPath, 'utf8'))

const TIMEOUT = 8000
const CONCURRENCY = 10

const probe = async (url) => {
  for (const method of ['HEAD', 'GET']) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT)
    try {
      const response = await fetch(url, {
        method,
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) uuznav/1.0'
        }
      })
      clearTimeout(timer)
      if (response.body) {
        await response.body.cancel().catch(() => {})
      }
      if (response.status < 400) {
        return { state: 'alive', reason: `HTTP ${response.status}` }
      }
      if (method === 'GET') {
        return { state: 'warn', reason: `HTTP ${response.status}` }
      }
    } catch (error) {
      clearTimeout(timer)
      if (method === 'GET') {
        const code = error?.cause?.code || error?.name || error?.message
        return { state: 'dead', reason: code === 'AbortError' ? 'timeout' : String(code) }
      }
    }
  }
  return { state: 'dead', reason: 'unknown' }
}

const results = []
let cursor = 0
let done = 0
let warnCount = 0
let deadCount = 0

const isTTY = process.stdout.isTTY === true

const renderProgress = (title) => {
  if (!isTTY) return
  const label = title.length > 24 ? `${title.slice(0, 24)}…` : title
  const aliveCount = done - warnCount - deadCount
  const line = `[${done}/${navLinks.length}] alive ${aliveCount} warn ${warnCount} dead ${deadCount} | ${label}`
  process.stdout.write(`\r${line.padEnd(80, ' ')}`)
}

const worker = async () => {
  while (cursor < navLinks.length) {
    const link = navLinks[cursor++]
    const started = Date.now()
    const result = await probe(link.url)
    results.push({ ...result, title: link.title, url: link.url, ms: Date.now() - started })
    done++
    if (result.state === 'warn') warnCount++
    if (result.state === 'dead') deadCount++
    renderProgress(link.title)
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()))

if (isTTY) {
  process.stdout.write('\n')
}

const dead = results.filter(item => item.state === 'dead')
const warn = results.filter(item => item.state === 'warn')
const alive = results.length - dead.length - warn.length

dead.forEach(item => {
  console.log(`[DEAD] ${item.title}`)
  console.log(`       ${item.url}`)
  console.log(`       ${item.reason}`)
})

warn.forEach(item => {
  console.log(`[WARN] ${item.title}`)
  console.log(`       ${item.url}`)
  console.log(`       ${item.reason}`)
})

console.log('')
console.log(`total ${results.length} | alive ${alive} | warn ${warn.length} | dead ${dead.length}`)

process.exitCode = dead.length ? 1 : 0
