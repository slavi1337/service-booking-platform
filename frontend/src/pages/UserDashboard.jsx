import React, { useState, useEffect } from 'react'

import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material'

const fakeApiCall = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          {
            id: 1,
            name: 'AA',
            category: 'b',
            description: 'ccc c',
            price: 20,
            durationInMinutes: 30,
            tenantName: 'aa bb',
          },
          {
            id: 2,
            name: 'BB',
            category: 'a',
            description: 'ccc c',
            price: 20,
            durationInMinutes: 30,
            tenantName: 'aa bb',
          },
        ],
      })
    }, 1000)
  })
}

const UserDashboard = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fakeApiCall()
        setServices(response.data)
      } catch (err) {
        setError('Error fetching services')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return <CircularProgress />
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  return (
    <Container>
      <Typography gutterBottom variant="h4">
        Available Services
      </Typography>
      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item key={service.id} md={4} sm={6} xs={12}>
            <Card>
              <CardContent>
                <Typography component="div" variant="h5">
                  {service.name}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                  {service.category} - {service.tenantName}
                </Typography>
                <Typography variant="body2">{service.description}</Typography>
                <Typography sx={{ mt: 2 }} variant="h6">
                  Price: {service.price} €
                </Typography>
                <Typography variant="body1">Duration: {service.durationInMinutes} min</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default UserDashboard
