import { pipe, right } from '@matheuspuel/fp-ts-reexports'
import { Task } from 'fp-ts/lib/Task'
import http from 'http'
import { fetch, filterStatus } from '.'

const PORT = 4444
const SERVER_URL = 'http://localhost:' + PORT

const server: { start: Task<void>; close: Task<void> } = (() => {
  const server = http.createServer((req, res) => {
    req.pipe(res)
    // const list: Buffer[] = []
    // req.on('data', v => list.push(v))
    // req.on('end', v => {
    //   if (v) list.push(v)
    //   const body = Buffer.concat(list).toString()
    //   const data = {
    //     method: req.method,
    //     url: req.url,
    //     headers: req.headers,
    //     body: body,
    //   }
    //   const json = JSON.stringify(data)
    //   res.end(json)
    // })
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
  const main = pipe(
    fetch({
      method: 'POST',
      url: SERVER_URL,
      headers: {},
      body: 'mock',
    }),
    filterStatus(v => v === 200),
  )

  const res = await main()

  expect(res).toEqual<typeof res>(right({ status: 200, body: 'mock' }))
})
