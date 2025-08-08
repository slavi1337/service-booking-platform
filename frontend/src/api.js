import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

export const registerUser = (userData) => {
  return axios.post(`${API_BASE_URL}/auth/register`, userData)
}

export const loginUser = (credentials) => {
  return axios.post(`${API_BASE_URL}/auth/login`, credentials)
}
