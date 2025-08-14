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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
      }}
    >
      {user ? (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button color="error" onClick={logout} variant="outlined">
            Logout
          </Button>
        </Box>
      ) : null}

      <Container
        maxWidth="sm"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Typography component="h1" gutterBottom variant="h4">
          Welcome to Service Booking Platform
        </Typography>

        {user ? (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">
              Logged in as:{' '}
              {user.businessName || `${user.firstName} ${user.lastName}` || user.email}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }} variant="body1">
              (Role: {user.role.replace('ROLE_', '')})
            </Typography>

            <Link style={{ textDecoration: 'none' }} to={dashboardPath}>
              <Button size="large" sx={{ m: 1 }} variant="contained">
                Go to Dashboard
              </Button>
            </Link>

            {user.role === 'ROLE_USER' ? (
              <Link style={{ textDecoration: 'none' }} to="/my-bookings">
                <Button color="secondary" size="large" sx={{ m: 1 }} variant="contained">
                  My Reservations
                </Button>
              </Link>
            ) : null}
          </Box>
        ) : (
          <Box sx={{ mt: 4 }}>
            <Typography sx={{ mb: 2 }} variant="body1">
              Please login to continue.
            </Typography>
            <Button onClick={() => navigate('/login')} size="large" variant="contained">
              Login
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default HomePage
