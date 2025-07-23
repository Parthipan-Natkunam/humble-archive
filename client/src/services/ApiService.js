import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`)
    return response.data
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data)
    const message = error.response?.data?.error || error.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

export const apiService = {
  // Scrape books from URL
  async scrapeBooks(url, groupName) {
    return api.post('/scrape-data', { url, groupName })
  },

  // Get all groups with pagination
  async getGroups(page = 1, limit = 10) {
    return api.get('/groups', { params: { page, limit } })
  },

  // Get books in a specific group
  async getGroupBooks(groupId, page = 1, limit = 20) {
    return api.get(`/groups/${groupId}/books`, { params: { page, limit } })
  },

  // Health check
  async healthCheck() {
    return api.get('/health')
  }
}

export default apiService 