import React from 'react'

import { Container, Typography, Button, Box } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

const HomePage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" gutterBottom variant="h4">
          Welcome to Service Booking Platform
        </Typography>

        {user ? (
          <Box sx={{ mt: 4 }} textAlign="center">
            <Typography variant="h6">
              You are logged in as {user.email} ({user.role.replace('ROLE_', '')})
            </Typography>
            <Button onClick={logout} sx={{ mt: 2 }} variant="outlined">
              Log out
            </Button>
            <br />
            <Link style={{ marginTop: '16px', display: 'inline-block' }} to="/dashboard">
              <Button variant="contained">Go to your dashboard</Button>
            </Link>
          </Box>
        ) : (
          <Box sx={{ mt: 4 }}>
            <Button onClick={() => navigate('/login')} size="large" variant="contained">
              Log in
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default HomePage
