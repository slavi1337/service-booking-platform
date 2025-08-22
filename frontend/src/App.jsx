import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import HomePage from './pages/HomePage'
import MyBookingsPage from './pages/MyBookingsPage'
import ServiceDetailsPage from './pages/ServiceDetailsPage'
import TenantDashboard from './pages/TenantDashboard'
import TenantServicesPage from './pages/TenantServicesPage'
import UserDashboard from './pages/UserDashboard'
import EditServicePage from './pages/EditServicePage'
import AdminDashboard from './pages/AdminDashboard'
import MainLayout from './components/layout/MainLayout';
import OAuth2RedirectHandler from './pages/auth/OAuth2RedirectHandler'
import ManageCategories from './pages/admin/ManageCategories'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>

          <Route element={<HomePage />} path="/" />
          <Route element={<LoginPage />} path="/login" />
          <Route element={<RegisterPage />} path="/register" />

          <Route element={<UserDashboard />} path="/dashboard" />
          <Route element={<TenantDashboard />} path="/tenant-dashboard" />

          <Route element={<TenantServicesPage />} path="/tenants/:tenantId/services" />
          <Route element={<ServiceDetailsPage />} path="/services/:serviceId" />

          <Route element={<MyBookingsPage />} path="/my-bookings" />
          <Route element={<EditServicePage />} path="/edit-service/:serviceId" />

          <Route element={<AdminDashboard />} path="/admin-dashboard" />
          <Route element={<ManageCategories />} path="/admin/categories" />
          <Route element={<OAuth2RedirectHandler />} path="/oauth2/redirect" />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
