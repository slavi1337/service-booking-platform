import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user')
      return storedUser ? JSON.parse(storedUser) : null
    } catch (error) {
      return null
    }
  })

  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const login = (userData, tokenData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', tokenData)
    setUser(userData)
    setToken(tokenData)
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    setToken(null)
  }

  const value = { user, token, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
