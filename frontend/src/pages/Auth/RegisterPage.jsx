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
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../api'
import { registerSchema } from './registerSchema'
import { zodResolver } from '@hookform/resolvers/zod'

const RegisterPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'ROLE_USER',
    },
  })
  const [serverError, setServerError] = useState(null)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setServerError(null)
    try {
      await registerUser(data)
      navigate('/login')
    } catch (err) {
      let errorMessage = 'An error occurred while registering. Please try again later.'
      if (err.response) {
        if (
          err.response.status === 409 ||
          err.response.data?.message?.includes('Duplicate entry')
        ) {
          errorMessage = 'Email address is already in use.'
        } else {
          errorMessage = err.response.data?.message || errorMessage
        }
      }
      setServerError(errorMessage)
    }
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>

        {serverError && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {serverError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }} noValidate>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  error={!!errors.firstName}
                  helperText={errors.firstName ? errors.firstName.message : ''}
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
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  error={!!errors.lastName}
                  helperText={errors.lastName ? errors.lastName.message : ''}
                />
              )}
            />
          </Box>

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
                name="password"
                label="Password"
                type="password"
                id="password"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
              />
            )}
          />

          <FormControl component="fieldset" error={!!errors.role} sx={{ mt: 2 }}>
            <FormLabel component="legend">I am a...</FormLabel>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field} row>
                  <FormControlLabel value="ROLE_USER" control={<Radio />} label="Standard User" />
                  <FormControlLabel
                    value="ROLE_TENANT"
                    control={<Radio />}
                    label="Service Provider"
                  />
                </RadioGroup>
              )}
            />
            <FormHelperText>{errors.role ? errors.role.message : ''}</FormHelperText>
          </FormControl>

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
              <Typography color="primary" variant="body2">
                Already have an account? Log in
              </Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default RegisterPage
