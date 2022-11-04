import { constTrue, pipe, TE } from '@matheuspuel/fp-ts-reexports'
import axios from 'axios'
import { Predicate } from 'fp-ts/Predicate'
import { TaskEither } from 'fp-ts/TaskEither'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH'

export type HttpHeaders = Record<string, string>

export type FetchInput = {
  method: HttpMethod
  url: string
  headers: HttpHeaders
  body: string
}

export type FetchError = {
  _tag: 'FetchError'
  input: FetchInput
  error: unknown
}

const fetchError =
  (input: FetchInput) =>
  (error: unknown): FetchError => ({ _tag: 'FetchError', input, error })

export type HttpStatusError = {
  _tag: 'HttpStatusError'
  response: HttpResponse
}

const httpStatusError = (response: HttpResponse): HttpStatusError => ({
  _tag: 'HttpStatusError',
  response,
})

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
          data: input.body,
          validateStatus: constTrue,
        }),
      fetchError(input),
    ),
    TE.map(r => ({ status: r.status, body: r.data })),
  )

export const filterStatus =
  (predicate: Predicate<number>) =>
  (
    response: TaskEither<FetchError, HttpResponse>,
  ): TaskEither<FetchError | HttpStatusError, HttpResponse> =>
    pipe(
      response,
      TE.chainW(v =>
        predicate(v.status) ? TE.right(v) : TE.left(httpStatusError(v)),
      ),
    )
