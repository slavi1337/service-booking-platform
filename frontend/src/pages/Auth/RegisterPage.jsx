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
  Input,
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
    setValue,
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
      image: undefined,
      role: 'ROLE_USER',
    },
  })
  const selectedRole = watch('role')

  const [serverError, setServerError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setServerError(null)
    const formData = new FormData()
    const userData = { ...data }
    delete userData.image
    formData.append('user', new Blob([JSON.stringify(userData)], { type: 'application/json' }))

    if (data.image && data.image.length > 0) {
      formData.append('imageFile', data.image[0])
    }

    setSuccessMessage('')
    try {
      await registerUser(formData)
      setSuccessMessage('Registration successful! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setServerError(err.response?.data?.message || 'An error occurred during registration.')
    }
  }

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(88, 186, 216, 1)' },
      '&:hover fieldset': { borderColor: 'rgba(88, 186, 216, 1)' },
      '&.Mui-focused fieldset': { borderColor: 'rgba(88, 186, 216, 1)' },
      '& input, & textarea': { color: 'rgba(88, 186, 216, 1)' },
    },
    '& label, & label.Mui-focused': {
      color: 'rgba(88, 186, 216, 1)',
    },
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
                        helperText={errors.firstName?.message}
                        sx={textFieldStyles}
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
                        helperText={errors.lastName?.message}
                        sx={textFieldStyles}
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
                        helperText={errors.businessName?.message}
                        sx={textFieldStyles}
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
                        helperText={errors.businessDescription?.message}
                        sx={textFieldStyles}
                      />
                    )}
                  />
                  <FormControl fullWidth margin="normal" error={!!errors.image}>
                    <FormLabel sx={{ color: 'rgba(88, 186, 216, 1)' }}>
                      Profile Image or Logo
                    </FormLabel>
                    <Button variant="contained" component="label" sx={{ mt: 1 }}>
                      Upload File
                      <input
                        type="file"
                        hidden
                        onChange={(e) => setValue('image', e.target.files)}
                      />
                    </Button>
                    {watch('image') && watch('image').length > 0 && (
                      <Typography variant="body2" sx={{ mt: 1, color: 'rgba(88, 186, 216, 1)' }}>
                        {watch('image')[0].name}
                      </Typography>
                    )}
                    {errors.image && (
                      <FormHelperText sx={{ color: '#ffcdd2' }}>
                        {errors.image.message}
                      </FormHelperText>
                    )}
                  </FormControl>
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
                    helperText={errors.email?.message}
                    sx={textFieldStyles}
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
                    helperText={errors.password?.message}
                    sx={textFieldStyles}
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
