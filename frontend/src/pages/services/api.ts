import { FetchClient, FetchError, RequestConfig } from '../../lib/fetchClient'

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`

export const api = new FetchClient({
  baseURL: API_BASE_URL,
})

export const setupInterceptors = (
  getAccessToken: () => string | null,
  refreshAccessToken: () => Promise<void>
) => {
  api.interceptors.request.use((config: RequestConfig) => {
    const token = getAccessToken()
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }
    return config
  })

  api.interceptors.response.use(
    (response) => response,
    async (error: FetchError) => {
      const originalRequest = error.config as RequestConfig & {
        _retry?: boolean
      }

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true

        try {
          await refreshAccessToken()

          const token = getAccessToken()
          if (token) {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            }
          }

          return api.retryRequest(originalRequest)
        } catch (refreshError) {
          return Promise.reject(error)
        }
      }

      return Promise.reject(error)
    }
  )
}
