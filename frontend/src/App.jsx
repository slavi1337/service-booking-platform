import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LoginPage from './pages/Auth/LoginPage'
import HomePage from './pages/HomePage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<LoginPage />} path="/login" />
      </Routes>
    </BrowserRouter>
  )
}

export default App
