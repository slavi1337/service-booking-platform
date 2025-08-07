import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Container, Typography, TextField, Button, Box } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { loginSchema } from './loginSchema'

const LoginPage = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data) => {
    console.log(data)
  }

  console.log(errors)

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

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                error={errors?.email?.message}
                fullWidth
                helperText={errors?.email?.message}
                id="email"
                label="Email Address"
                margin="normal"
                name="email"
                required
              />
            )}
            rules={{ required: true }}
          />

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <TextField
                {...field}
                error={errors?.password?.message}
                fullWidth
                helperText={errors?.password?.message}
                id="password"
                label="Password"
                margin="normal"
                name="password"
                required
                type="password"
              />
            )}
            rules={{ required: true }}
          />

          <input type="submit" />

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
