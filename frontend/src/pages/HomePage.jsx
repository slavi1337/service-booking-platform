import React from 'react'

import { Container, Typography, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const handleLoginRedirect = () => {
    navigate('/login')
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4">
          Welcome to the Home Page
        </Typography>
        <Button onClick={handleLoginRedirect} sx={{ mt: 3 }} variant="contained">
          Go to Login
        </Button>
      </Box>
    </Container>
  )
}

export default HomePage
