import { right } from '@matheuspuel/fp-ts-reexports'
import { Task } from 'fp-ts/lib/Task'
import http from 'http'
import { fetch } from '.'

const PORT = 4444
const SERVER_URL = 'http://localhost:' + PORT

const server: { start: Task<void>; close: Task<void> } = (() => {
  const server = http.createServer((req, res) => {
    res.end('mock')
  })
  return {
    start: () => new Promise(r => server.listen(PORT, () => r())),
    close: () => new Promise(r => server.close(() => r())),
  }
})()

beforeAll(async () => {
  await server.start()
})

afterAll(async () => {
  await server.close()
})

test('should fetch', async () => {
  const main = fetch({
    method: 'POST',
    url: SERVER_URL,
    headers: {},
    data: '',
  })

  const res = await main()

  expect(res).toEqual<typeof res>(right({ status: 200, body: 'mock' }))
})
