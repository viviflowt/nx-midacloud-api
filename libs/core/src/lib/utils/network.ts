import { isDevelopment } from '@mida/common'
import net from 'node:net'

const MAX_PORT = 65_535

const getFreePort = async (
  currentPort: number,
  limit = MAX_PORT,
): Promise<number> => {
  const port = currentPort

  if (limit && port > limit) {
    throw new Error(`No free port found`)
  }

  return new Promise((resolve, reject) => {
    const server = net.createServer()

    server.on('error', () => {
      resolve(getFreePort(port + 1, limit))
    })

    server.listen(port, () => {
      server.close(() => {
        resolve(port)
      })
    })
  })
}

export const getPort = async (port = 3000): Promise<number> => {
  if (!isDevelopment()) {
    return port
  }

  return getFreePort(port, port + 1000)
}

export const isListening = async (
  host: string,
  port: number | string,
): Promise<boolean> => {
  return new Promise((resolve) => {
    const socket = net.createConnection(Number(port), host)

    socket.on('connect', () => {
      socket.end()
      resolve(true)
    })

    socket.on('error', () => {
      resolve(false)
    })
  })
}
