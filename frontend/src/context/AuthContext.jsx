import React, { createContext, useState, useContext, useEffect } from 'react'

import { jwtDecode } from 'jwt-decode'
const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const decodedToken = jwtDecode(token)
        if (decodedToken.exp * 1000 > Date.now()) {
          return { email: decodedToken.sub, role: decodedToken.role }
        }
      }
      return null
    } catch (error) {
      return null
    }
  })

  const login = (token) => {
    localStorage.setItem('token', token)
    const decodedToken = jwtDecode(token)
    setUser({ email: decodedToken.sub, role: decodedToken.role })
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = { user, login, logout, token: localStorage.getItem('token') }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
