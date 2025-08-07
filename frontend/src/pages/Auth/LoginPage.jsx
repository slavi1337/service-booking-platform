import React from 'react'

import { Container, Typography, TextField, Button, Box } from '@mui/material'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  const handleLogin = (event) => {
    event.preventDefault()
  }

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Log in
        </Typography>

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            fullWidth
            id="email"
            label="Email Address"
            margin="normal"
            name="email"
            required
          />
          <TextField
            fullWidth
            id="password"
            label="Password"
            margin="normal"
            name="password"
            required
            type="password"
          />

          <Button fullWidth sx={{ mt: 3, mb: 2 }} type="submit" variant="contained">
            Log in
          </Button>

          <Box textAlign="center">
            <Link style={{ color: 'inherit', textDecoration: 'none' }} to="/register">
              <Typography color="primary" variant="body2">
                Do not have an account? Register!
              </Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default LoginPage
