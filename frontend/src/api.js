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

export const registerUser = (userData) => apiClient.post('/auth/register', userData)
export const loginUser = (credentials) => apiClient.post('/auth/login', credentials)
export const createService = (serviceData, tenantId) =>
  apiClient.post(`/services?tenantId=${tenantId}`, serviceData)

export const getAllTenants = () => apiClient.get('/users/tenants')
export const getServicesByTenant = (tenantId) => apiClient.get(`/services/tenant/${tenantId}`)
export const getServiceById = (id) => apiClient.get(`/services/${id}`)
export const getAllSlotStatusesForService = (serviceId, date) => {
  return apiClient.get(`/availabilities/service/${serviceId}/all-slots?date=${date}`)
}
export const createBooking = (bookingData) => {
  return apiClient.post('/bookings', bookingData)
}

export const getMyServices = () => apiClient.get('/services/my-services')

export const getBookingDetails = (bookingId) => {
  return apiClient.get(`/bookings/${bookingId}/details`)
}

export const toggleAvailability = (availabilityId, isAvailable) => {
  return apiClient.patch(`/availabilities/${availabilityId}/toggle?isAvailable=${isAvailable}`)
}

export const getMyBookings = () => {
  return apiClient.get('/bookings/my-bookings')
}

export const cancelBooking = (bookingId) => {
  return apiClient.delete(`/bookings/${bookingId}`)
}
