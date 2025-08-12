import axios, { AxiosInstance } from 'axios'

const BASE_URL = 'http://localhost:3000/api'

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

    // Request interceptor to add token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token') // Retrieve token from localStorage
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const response = await this.api.get<T>(endpoint, { params })
    return response.data
  }

  // POST request
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.api.post<T>(endpoint, data)
    return response.data
  }

  // PUT request
  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.api.put<T>(endpoint, data)
    return response.data
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.api.delete<T>(endpoint)
    return response.data
  }
}

const apiService = new ApiService()
export default apiService