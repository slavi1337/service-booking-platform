import React, { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Divider, Typography, TextField, Button, Box, Alert, Paper, CssBaseline, Grid } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google';
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
  const GOOGLE_AUTH_URL = "http://localhost:8080/oauth2/authorization/google";

  const onSubmit = async (data) => {
    setServerError(null)
    try {
      const response = await loginUser(data)

      const user = response.data.user
      const token = response.data.token

      login(user, token)

      if (user.role === 'ROLE_TENANT') {
        navigate('/')
      } else if (user.role === 'ROLE_ADMIN') {
        navigate('/admin-dashboard')
      } else {
        navigate('/')
      }
    } catch (err) {
      setServerError('Wrong email or password. Please try again.')
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/login.jpeg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <CssBaseline />

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}
      />

      <Paper
        elevation={8}
        sx={{
          position: 'relative',
          zIndex: 1,
          p: 4,
          borderRadius: 2,
          width: '100%',
          maxWidth: '400px',

          backgroundImage: 'url(/login-background.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography color="rgba(88, 186, 216, 1)" component="h1" variant="h5">
            Login
          </Typography>

          {serverError ? (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {serverError}
            </Alert>
          ) : null}

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1, width: '100%' }}
          >
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(88, 186, 216, 1)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(88, 186, 216, 1)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(88, 186, 216, 1)',
                      },
                      '& input': { color: 'rgba(88, 186, 216, 1)' },
                    },
                    '& label': {
                      color: 'rgba(88, 186, 216, 1)',
                    },
                  }}
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
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(88, 186, 216, 1)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(88, 186, 216, 1)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(88, 186, 216, 1)',
                      },
                      '& input': { color: 'rgba(88, 186, 216, 1)' },
                    },
                    '& label': {
                      color: 'rgba(88, 186, 216, 1)',
                    },
                  }}
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
            <Divider sx={{ my: 2 }}>OR</Divider>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              href={GOOGLE_AUTH_URL}
              sx={{ mb: 2 }}
            >
              Continue with Google
            </Button>

            <Grid container justifyContent="center">
              <Grid item>
                <Link style={{ textDecoration: 'none' }} to="/register">
                  <Typography color="rgba(88, 186, 216, 1)" variant="body2">
                    Do not have an account? Sign Up
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
export default LoginPage
