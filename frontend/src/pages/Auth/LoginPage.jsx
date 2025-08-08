import React, { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material'
import { jwtDecode } from 'jwt-decode'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { loginSchema } from './loginSchema'
import { loginUser } from '../../api'
import { useAuth } from '../../context/AuthContext'

const LoginPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const [serverError, setServerError] = useState(null)
  const navigate = useNavigate()
  const { login } = useAuth()

  const onSubmit = async (data) => {
    setServerError(null)
    try {
      const response = await loginUser(data)

      const token = response.data.token

      login(token)

      const decodedToken = jwtDecode(token)
      if (decodedToken.role === 'ROLE_TENANT') {
        navigate('/tenant-dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setServerError('Wrong email or password. Please try again.')
    }
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Prijavi se
        </Typography>

        {serverError ? (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {serverError}
          </Alert>
        ) : null}

        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextField
                {...field}
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                fullWidth
                helperText={errors.email ? errors.email.message : ''}
                id="email"
                label="Email Address"
                margin="normal"
                required
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <TextField
                {...field}
                autoComplete="current-password"
                error={!!errors.password}
                fullWidth
                helperText={errors.password ? errors.password.message : ''}
                id="password"
                label="Password"
                margin="normal"
                name="password"
                required
                type="password"
              />
            )}
          />

          <Button
            disabled={isSubmitting}
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            type="submit"
            variant="contained"
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </Button>

          <Box textAlign="center">
            <Link style={{ textDecoration: 'none' }} to="/register">
              <Typography color="primary" variant="body2">
                Don't have an account? Sign up
              </Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default LoginPage
