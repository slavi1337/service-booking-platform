import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import HomePage from './pages/HomePage'
import ServiceDetailsPage from './pages/ServiceDetailsPage'
import TenantDashboard from './pages/TenantDashboard'
import UserDashboard from './pages/UserDashboard'
import TenantServicesPage from './pages/TenantServicesPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/register" />

        <Route element={<UserDashboard />} path="/dashboard" />
        <Route element={<TenantDashboard />} path="/tenant-dashboard" />

        <Route element={<TenantServicesPage />} path="/tenants/:tenantId/services" />
        <Route element={<ServiceDetailsPage />} path="/services/:serviceId" />
      </Routes>
    </BrowserRouter>
  )
}

export default App
