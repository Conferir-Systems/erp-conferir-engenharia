export interface RequestConfig {
  headers?: Record<string, string>
  _retry?: boolean
  method?: string
  url?: string
  data?: unknown
  [key: string]: unknown
}

export class FetchError<T = unknown> extends Error {
  response?: {
    status: number
    statusText: string
    data: T
  }
  config?: RequestConfig
  code?: string

  constructor(
    message: string,
    options?: {
      response?: { status: number; statusText: string; data: T }
      config?: RequestConfig
      code?: string
    }
  ) {
    super(message)
    this.name = 'FetchError'
    this.response = options?.response
    this.config = options?.config
    this.code = options?.code

    Object.setPrototypeOf(this, FetchError.prototype)
  }
}

export function isFetchError(error: unknown): error is FetchError {
  return error instanceof FetchError
}

type RequestInterceptor = (
  config: RequestConfig
) => RequestConfig | Promise<RequestConfig>
type ResponseInterceptor = (response: Response) => Response | Promise<Response>
type ErrorInterceptor = <T = unknown>(
  error: FetchError
) => Promise<{ data: T }> | Promise<never>

export class FetchClient {
  private baseURL: string
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []
  private errorInterceptors: ErrorInterceptor[] = []

  constructor(config: { baseURL: string }) {
    this.baseURL = config.baseURL
  }

  interceptors = {
    request: {
      use: (onFulfilled: RequestInterceptor) => {
        this.requestInterceptors.push(onFulfilled)
      },
    },
    response: {
      use: (
        onFulfilled: ResponseInterceptor,
        onRejected?: ErrorInterceptor
      ) => {
        this.responseInterceptors.push(onFulfilled)
        if (onRejected) {
          this.errorInterceptors.push(onRejected)
        }
      },
    },
  }

  private buildUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    return `${this.baseURL}${url}`
  }

  private async runRequestInterceptors(
    config: RequestConfig
  ): Promise<RequestConfig> {
    let finalConfig = { ...config }
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig)
    }
    return finalConfig
  }

  private async runResponseInterceptors(response: Response): Promise<Response> {
    let finalResponse = response
    for (const interceptor of this.responseInterceptors) {
      finalResponse = await interceptor(finalResponse)
    }
    return finalResponse
  }

  private async runErrorInterceptors(error: unknown): Promise<never> {
    let finalError = error as FetchError
    for (const interceptor of this.errorInterceptors) {
      try {
        await interceptor(finalError)
      } catch (err) {
        finalError = err as FetchError
      }
    }
    throw finalError
  }

  private async request<T>(
    method: string,
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<{ data: T }> {
    const fullUrl = this.buildUrl(url)
    const finalConfig = await this.runRequestInterceptors({
      ...config,
      method,
      url,
      data,
    })

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...finalConfig.headers,
      },
    }

    if (data !== undefined) {
      options.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(fullUrl, options)
      const finalResponse = await this.runResponseInterceptors(response)

      let responseData: unknown
      const contentType = finalResponse.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const text = await finalResponse.text()
        responseData = text ? JSON.parse(text) : {}
      } else {
        const text = await finalResponse.text()
        responseData = text || {}
      }

      if (!finalResponse.ok) {
        throw new FetchError(
          `Request failed with status ${finalResponse.status}`,
          {
            response: {
              status: finalResponse.status,
              statusText: finalResponse.statusText,
              data: responseData as T,
            },
            config: finalConfig,
          }
        )
      }

      return { data: responseData as T }
    } catch (error) {
      if (error instanceof TypeError && !isFetchError(error)) {
        throw new FetchError('Network request failed', {
          code: 'NETWORK_ERROR',
          config: finalConfig,
        })
      }
      if (isFetchError(error)) {
        return await this.runErrorInterceptors(error)
      }

      throw error
    }
  }

  async retryRequest<T>(requestConfig: RequestConfig): Promise<{ data: T }> {
    const { method, url, data, ...config } = requestConfig
    if (!method || !url) {
      throw new Error('Cannot retry request: missing method or url')
    }
    return this.request<T>(method, url, data, config)
  }

  async get<T>(url: string, config?: RequestConfig): Promise<{ data: T }> {
    return this.request<T>('GET', url, undefined, config)
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<{ data: T }> {
    return this.request<T>('POST', url, data, config)
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<{ data: T }> {
    return this.request<T>('PUT', url, data, config)
  }

  async delete(url: string, config?: RequestConfig): Promise<{ data: void }> {
    return this.request<void>('DELETE', url, undefined, config)
  }
}
