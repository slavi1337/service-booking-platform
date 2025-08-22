import React from 'react'

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  let dashboardPath = '/dashboard'
  if (user) {
    if (user.role === 'ROLE_TENANT') dashboardPath = '/tenant-dashboard'
    if (user.role === 'ROLE_ADMIN') dashboardPath = '/admin-dashboard'
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#65a6f5ff' }}>
      <Toolbar>
        <Typography
          component={RouterLink}
          sx={{ color: 'inherit', textDecoration: 'none' }}
          to="/"
          variant="h6"
        >
          Booking Platform
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 2 }} variant="subtitle1">
              Welcome,{' '}
              {user.role === 'ROLE_TENANT'
                ? user.businessName
                : `${user.firstName} ${user.lastName}`}
            </Typography>
            <Button color="inherit" component={RouterLink} to={dashboardPath}>
              My Dashboard
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
            <Button color="inherit" component={RouterLink} to="/register">
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
