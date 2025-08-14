import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import HomePage from './pages/HomePage'
import MyBookingsPage from './pages/MyBookingsPage'
import ServiceDetailsPage from './pages/ServiceDetailsPage'
import TenantDashboard from './pages/TenantDashboard'
import TenantServicesPage from './pages/TenantServicesPage'
import UserDashboard from './pages/UserDashboard'
import EditServicePage from './pages/EditServicePage'
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

        <Route element={<MyBookingsPage />} path="/my-bookings" />
        <Route element={<EditServicePage />} path="/edit-service/:serviceId" />
      </Routes>
    </BrowserRouter>
  )
}

export default App
