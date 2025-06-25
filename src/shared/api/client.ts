import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL, ROUTES } from '@config/constants'
import { message } from 'antd'

interface ApiErrorResponse {
  message: string
  [key: string]: unknown
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Try to refresh token
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          })
          const { access_token, refresh_token: newRefreshToken } = response.data
          localStorage.setItem('access_token', access_token)
          if (newRefreshToken) {
            localStorage.setItem('refresh_token', newRefreshToken)
          }
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return apiClient(originalRequest)
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = ROUTES.LOGIN
          return Promise.reject(refreshError)
        }
      } else {
        // No refresh token, redirect to login
        localStorage.removeItem('access_token')
        window.location.href = ROUTES.LOGIN
      }
    }

    // Show error message
    if (error.response?.data?.message) {
      message.error(error.response.data.message)
    } else if (error.message) {
      message.error(error.message)
    }

    return Promise.reject(error)
  },
)

export default apiClient 