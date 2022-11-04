import { constTrue, pipe, TE } from '@matheuspuel/fp-ts-reexports'
import axios from 'axios'
import { TaskEither } from 'fp-ts/TaskEither'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH'

export type HttpHeaders = Record<string, string>

export type FetchInput = {
  method: HttpMethod
  url: string
  headers: HttpHeaders
  data: string
}

export type FetchError = {
  _tag: 'FetchError'
  input: FetchInput
  error: unknown
}

const fetchError =
  (input: FetchInput) =>
  (error: unknown): FetchError => ({ _tag: 'FetchError', input, error })

export type HttpResponse = {
  status: number
  body: unknown
}

export const fetch = (
  input: FetchInput,
): TaskEither<FetchError, HttpResponse> =>
  pipe(
    TE.tryCatch(
      () =>
        axios({
          url: input.url,
          method: input.method,
          headers: input.headers,
          data: input.data,
          validateStatus: constTrue,
        }),
      e => e,
    ),
    TE.mapLeft(fetchError(input)),
    TE.map(r => ({ status: r.status, body: r.data })),
  )
