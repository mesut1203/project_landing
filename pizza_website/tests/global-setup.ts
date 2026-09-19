import { createServer } from 'vite'

export default async function globalSetup() {
  // Reuse an existing development server without taking ownership of its lifecycle.
  try {
    const response = await fetch('http://127.0.0.1:5173', { signal: AbortSignal.timeout(1_000) })
    if (response.ok) return
  } catch {
    // The test run will own the server started below.
  }

  // Starting Vite in this process avoids Windows shell/taskkill teardown behavior.
  const server = await createServer({
    server: { host: '127.0.0.1', port: 5173, strictPort: true },
    logLevel: 'error',
  })
  await server.listen()
  return async () => {
    await server.close()
  }
}
