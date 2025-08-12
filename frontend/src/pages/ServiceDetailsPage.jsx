import React, { useState, useEffect } from 'react'

import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Button,
  TextField,
} from '@mui/material'
import { useParams } from 'react-router-dom'

import { getServiceById, getAvailableSlotsForService } from '../api'

const ServiceDetailsPage = () => {
  const { serviceId } = useParams()
  const [service, setService] = useState(null)
  const [slots, setSlots] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await getServiceById(serviceId)
        setService(response.data)
      } catch (err) {
        setError('Failed to fetch service details.')
      }
    }
    fetchServiceDetails()
  }, [serviceId])

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true)
      try {
        const response = await getAvailableSlotsForService(serviceId, selectedDate);
        console.log("Podaci dobijeni sa servera:", response.data);
        setSlots(response.data)
      } catch (err) {
        setError('Failed to fetch available slots.')
      } finally {
        setLoading(false)
      }
    }
    if (serviceId) {
      fetchSlots()
    }
  }, [selectedDate, serviceId])

  if (!service) {
    return <CircularProgress />
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  return (
    <Container>
      <Paper sx={{ p: 3, my: 4 }}>
        <Typography component="h1" gutterBottom variant="h4">
          {service.name}
        </Typography>
        <Typography color="text.secondary" gutterBottom variant="h6">
          {service.category}
        </Typography>
        <Typography sx={{ my: 2 }} variant="body1">
          {service.description}
        </Typography>
        <Typography variant="h5">Price: {service.price}€</Typography>
        <Typography variant="body1">Duration: {service.durationInMinutes} minutes</Typography>
      </Paper>

      <Box>
        <Typography gutterBottom variant="h5">
          Available Appointments
        </Typography>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          id="date"
          label="Select Date"
          onChange={(e) => setSelectedDate(e.target.value)}
          type="date"
          value={selectedDate}
        />
        {loading ? (
          <CircularProgress sx={{ display: 'block', mt: 2 }} />
        ) : (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {slots.length > 0 ? (
              slots.map((slot) => (
                <Grid item key={slot.id}>
                  <Button variant="outlined">
                    {new Date(slot.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Button>
                </Grid>
              ))
            ) : (
              <Typography sx={{ ml: 2 }}>No available slots for this date.</Typography>
            )}
          </Grid>
        )}
      </Box>
    </Container>
  )
}

export default ServiceDetailsPage
