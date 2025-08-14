import axios, { AxiosInstance } from 'axios'

const BASE_URL =  import.meta.env.VITE_API_URL

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )
  }

  // Login request
  async login<T>(credentials: { email: string; password: string }): Promise<T> {
    const response = await this.api.post<T>('/auth/login', credentials)
    return response.data
  }

  async register<T>(credentials: { email: string; password: string, name: string }): Promise<T> {
    const response = await this.api.post<T>('/auth/register', credentials)
    return response.data
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const response = await this.api.get<T>(endpoint, { params })
    return response.data
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.api.post<T>(endpoint, data)
    return response.data
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.api.put<T>(endpoint, data)
    return response.data
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.api.patch<T>(endpoint, data)
    return response.data
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.api.delete<T>(endpoint)
    return response.data
  }
}

const apiService = new ApiService()
export default apiService