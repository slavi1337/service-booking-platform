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
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setServerError(null)
    try {
      await registerUser(data)
      navigate('/login')
    } catch (err) {
      setServerError(err.response?.data?.message || 'An error occurred during registration.')
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="xs" disableGutters>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Register
          </Typography>

          {serverError && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {serverError}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1, width: '100%' }}
            noValidate
          >
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
              {errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
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
                <Typography color="primary" variant="body2">
                  Already have an account? Log in
                </Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default RegisterPage
