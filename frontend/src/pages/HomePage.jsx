import React from 'react'

import { Container, Typography, Button, Box, CssBaseline } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

const HomePage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  let dashboardPath = '/dashboard'
  if (user && user.role === 'ROLE_TENANT') {
    dashboardPath = '/tenant-dashboard'
  }

  const textColor = '#1976d2'

  return (
    // GLAVNI OMOTAČ - IMA POZADINSKU SLIKU I CENTRIRA SADRŽAJ
    <Box
      sx={{
        position: 'relative', // Potrebno za apsolutno pozicioniranje djeteta
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Samo vertikalno centriranje
        alignItems: 'center', // Samo horizontalno centriranje
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: 'url(/home.JPG)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <CssBaseline />

      {/* DIO ZA LOGOUT - SADA APSOLUTNO POZICIONIRAN */}
      {user ? (
        <Box
          sx={{
            position: 'absolute',
            top: 16, // 16px od vrha
            right: 16, // 16px od desne ivice
          }}
        >
          <Button color="primary" onClick={logout} variant="contained">
            Logout
          </Button>
        </Box>
      ) : null}

      {/* GLAVNI SADRŽAJ - KONTEJNER JE DIREKTNO UNUTAR GLAVNOG BOX-a */}
      <Container
        maxWidth="sm"
        sx={{
          // flexGrow nije više potreban jer roditelj radi svo centriranje
          textAlign: 'center',
        }}
      >
        <Typography
          component="h1"
          gutterBottom
          sx={{ color: textColor, fontWeight: 'bold' }}
          variant="h4"
        >
          Welcome to Service Booking Platform
        </Typography>

        {user ? (
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ color: textColor }} variant="h6">
              Logged in as:{' '}
              {user.businessName || `${user.firstName} ${user.lastName}` || user.email}
            </Typography>
            <Typography sx={{ mb: 3, color: textColor, opacity: 0.8 }}>
              (Role: {user.role.replace('ROLE_', '')})
            </Typography>

            <Link style={{ textDecoration: 'none' }} to={dashboardPath}>
              <Button size="large" sx={{ m: 1 }} variant="contained">
                Go to Dashboard
              </Button>
            </Link>

            {user.role === 'ROLE_USER' ? (
              <Link style={{ textDecoration: 'none' }} to="/my-bookings">
                <Button
                  size="large"
                  sx={{
                    m: 1,
                    backgroundColor: '#c69416ff', // <<< STANDARDNA ZLATNA BOJA
                    color: 'white', // Tekst je bijele boje radi kontrasta
                    '&:hover': {
                      backgroundColor: '#CFB53B', // Malo drugačija nijansa kada se pređe mišem
                    },
                  }}
                  variant="contained"
                >
                  My Reservations
                </Button>
              </Link>
            ) : null}
          </Box>
        ) : (
          <Box sx={{ mt: 4 }}>
            <Typography sx={{ mb: 2, color: textColor }} variant="body1">
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
