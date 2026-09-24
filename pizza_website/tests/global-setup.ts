import { createServer } from 'vite'

export default async function globalSetup() {
  // Own a dedicated server so another project's preview cannot be reused.
  // Starting Vite in this process avoids Windows shell/taskkill teardown behavior.
  const server = await createServer({
    server: { host: '127.0.0.1', port: 5187, strictPort: true },
    logLevel: 'error',
  })
  await server.listen()
  return async () => {
    await server.close()
  }
}
