import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function localApi(): Plugin {
  return {
    name: 'local-api',
    configureServer(server) {
      Object.assign(process.env, loadEnv('development', process.cwd(), ''))
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? ''
        const route = url.match(/^\/api\/([a-z]+)(\?|$)/)?.[1]
        if (!route) return next()
        try {
          const module = await server.ssrLoadModule(`/api/${route}.ts`)
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const headers = new Headers()
          Object.entries(req.headers).forEach(([key, value]) => {
            if (typeof value === 'string') headers.set(key, value)
          })
          const method = req.method ?? 'GET'
          const request = new Request(new URL(url, 'http://localhost'), {
            method,
            headers,
            body: method === 'GET' || method === 'HEAD' ? undefined : Buffer.concat(chunks),
          })
          const response: Response = await module.default(request)
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: String(error) }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localApi()],
})
