import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LoginPage from './pages/Auth/LoginPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoginPage />} path="/login" />
      </Routes>
    </BrowserRouter>
  )
}

export default App
