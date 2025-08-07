import React, { useState } from 'react'

import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { Link } from 'react-router-dom'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleRegister = (event) => {
    event.preventDefault()
    console.log('Registration info: ', formData)
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
          Registration
        </Typography>

        <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            fullWidth
            id="name"
            label="name"
            margin="normal"
            name="name"
            onChange={handleChange}
            required
            value={formData.username}
          />

          <TextField
            fullWidth
            id="surname"
            label="surname"
            margin="normal"
            name="surname"
            onChange={handleChange}
            required
            value={formData.username}
          />

          <TextField
            fullWidth
            id="username"
            label="username"
            margin="normal"
            name="username"
            onChange={handleChange}
            required
            value={formData.username}
          />

          <TextField
            fullWidth
            id="email"
            label="Email Address"
            margin="normal"
            name="email"
            onChange={handleChange}
            required
            value={formData.email}
          />
          <TextField
            fullWidth
            id="password"
            label="Password"
            margin="normal"
            name="password"
            onChange={handleChange}
            required
            type="password"
            value={formData.password}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">I am...</InputLabel>
            <Select
              id="role-select"
              label="I am..."
              labelId="role-select-label"
              name="role"
              onChange={handleChange}
              value={formData.role}
            >
              <MenuItem value="USER">standard user</MenuItem>
              <MenuItem value="TENANT">Tenant (Service provider)</MenuItem>
            </Select>
          </FormControl>

          <Button fullWidth sx={{ mt: 3, mb: 2 }} type="submit" variant="contained">
            Register
          </Button>

          <Box textAlign="center">
            <Link style={{ color: 'inherit', textDecoration: 'none' }} to="/login">
              <Typography color="primary" variant="body2">
                Already have an account? Login
              </Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default RegisterPage
