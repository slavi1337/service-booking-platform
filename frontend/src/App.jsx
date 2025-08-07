import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import HomePage from './pages/HomePage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<LoginPage />} path="/login" />

        <Route element={<RegisterPage />} path="/register" />

        <Route element={<Navigate to="/login" />} path="/" />
      </Routes>
    </BrowserRouter>
  )
}

export default App
