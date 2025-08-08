import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export const registerUser = (userData) => {
  return apiClient.post('/auth/register', userData)
}

export const loginUser = (credentials) => {
  return apiClient.post('/auth/login', credentials)
}

export const getAllServices = () => {
  return apiClient.get('/services')
}

export const getAvailableSlots = (date) => {
  return apiClient.get(`/slots/available?date=${date}`)
}

export const bookSlot = (slotId, bookingData) => {
  return apiClient.post(`/slots/${slotId}/book`, bookingData)
}
