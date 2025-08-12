import React from 'react'

import { Container, Typography, Button, Box } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

const HomePage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  let dashboardPath = '/dashboard'
  if (user && user.role === 'ROLE_TENANT') {
    dashboardPath = '/tenant-dashboard'
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography component="h1" gutterBottom variant="h4">
          Welcome to Service Booking Platform
        </Typography>

        {user ? (
          <Box sx={{ mt: 4 }} textAlign="center">
            <Typography variant="h6">
              Logged in as: {user.businessName || user.firstName || user.email}
            </Typography>
            <Typography color="text.secondary" variant="body1">
              (Role: {user.role.replace('ROLE_', '')})
            </Typography>

            <Link
              style={{ marginTop: '16px', display: 'inline-block', textDecoration: 'none' }}
              to={dashboardPath}
            >
              <Button variant="contained">Go to Dashboard</Button>
            </Link>

            {user.role === 'ROLE_USER' ? (
              <Box sx={{ mt: 2 }}>
                <Link style={{ textDecoration: 'none' }} to="/my-bookings">
                  <Button color="secondary" variant="contained">
                    My Reservations
                  </Button>
                </Link>
              </Box>
            ) : null}

            <br />

            <Button onClick={logout} sx={{ mt: 2 }} variant="outlined">
              Logout
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 4 }}>
            <Button onClick={() => navigate('/login')} size="large" variant="contained">
              Login
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default HomePage
