import React, { useState } from 'react'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Paper,
  CssBaseline,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from './registerSchema'
import { registerUser } from '../../api'

const RegisterPage = () => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      businessName: '',
      businessDescription: '',
      role: 'ROLE_USER',
    },
  })
  const selectedRole = watch('role')

  const [serverError, setServerError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setServerError(null)
    setSuccessMessage('')
    try {
      await registerUser(data)
      setSuccessMessage('Registration successful! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setServerError(err.response?.data?.message || 'An error occurred during registration.')
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
        py: 4,
        px: 2,
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
          width: '100%',
          maxWidth: '500px',
          p: 4,
          borderRadius: 2,
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
            color: 'rgba(88, 186, 216, 1)',
          }}
        >
          <Typography component="h1" variant="h5">
            Register
          </Typography>

          {serverError && (
            <Alert severity="error" sx={{ mt: 2, width: '100%', color: 'black' }}>
              {serverError}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mt: 2, width: '100%', color: 'black' }}>
              {successMessage}
            </Alert>
          )}

          {!successMessage && (
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1, width: '100%' }}
              noValidate
            >
              <FormControl component="fieldset" error={!!errors.role} sx={{ mt: 2 }}>
                <FormLabel component="legend" sx={{ color: 'rgba(88, 186, 216, 1)' }}>
                  I am a...
                </FormLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field} row>
                      <FormControlLabel
                        value="ROLE_USER"
                        control={<Radio sx={{ color: 'rgba(88, 186, 216, 1)' }} />}
                        label="Standard User"
                      />
                      <FormControlLabel
                        value="ROLE_TENANT"
                        control={<Radio sx={{ color: 'rgba(88, 186, 216, 1)' }} />}
                        label="Service Provider"
                      />
                    </RadioGroup>
                  )}
                />
                {errors.role && (
                  <FormHelperText sx={{ color: '#ffcdd2' }}>{errors.role.message}</FormHelperText>
                )}
              </FormControl>

              {selectedRole === 'ROLE_USER' && (
                <>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        margin="normal"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                        error={!!errors.firstName}
                        helperText={errors.firstName ? errors.firstName.message : ''}
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
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        margin="normal"
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        error={!!errors.lastName}
                        helperText={errors.lastName ? errors.lastName.message : ''}
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
                </>
              )}

              {selectedRole === 'ROLE_TENANT' && (
                <>
                  <Controller
                    name="businessName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        margin="normal"
                        required
                        fullWidth
                        id="businessName"
                        label="Business Name"
                        autoFocus
                        error={!!errors.businessName}
                        helperText={errors.businessName ? errors.businessName.message : ''}
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
                    name="businessDescription"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        margin="normal"
                        fullWidth
                        multiline
                        rows={3}
                        id="businessDescription"
                        label="Business Description (Optional)"
                        error={!!errors.businessDescription}
                        helperText={
                          errors.businessDescription ? errors.businessDescription.message : ''
                        }
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
                          '& input, & textarea': { color: 'rgba(88, 186, 216, 1)' },

                          '& label': {
                            color: 'rgba(88, 186, 216, 1)',
                          },
                        }}
                      />
                    )}
                  />
                </>
              )}

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ''}
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
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    id="password"
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ''}
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>

              <Box textAlign="center">
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(88, 186, 216, 1)', textDecoration: 'underline' }}
                  >
                    Already have an account? Log in
                  </Typography>
                </Link>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  )
}

export default RegisterPage
