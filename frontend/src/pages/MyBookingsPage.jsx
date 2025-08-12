import React, { useState, useEffect } from 'react'

import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Button,
} from '@mui/material'

import { getMyBookings, cancelBooking } from '../api'

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await getMyBookings()
      setBookings(response.data)
    } catch (err) {
      setError('Unsuccessful fetch of bookings')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchBookings()
  }, [])

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure that you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId)
        alert('Reservation successfully cancelled')
        fetchBookings()
      } catch (err) {
        alert('Error occurred while cancelling the booking')
      }
    }
  }

  if (loading)
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <CircularProgress />
      </Container>
    )
  if (error)
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    )

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography component="h1" gutterBottom variant="h4">
        My reservations
      </Typography>
      {bookings.length === 0 ? (
        <Typography>You do not have any bookings</Typography>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item key={booking.bookingId} md={4} sm={6} xs={12}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography component="h2" variant="h6">
                    {booking.serviceName}
                  </Typography>
                  <Typography color="text.secondary">Tenant: {booking.tenantName}</Typography>
                  <Typography sx={{ mt: 1.5 }}>
                    Date: {new Date(booking.date).toLocaleDateString()}
                  </Typography>
                  <Typography>Time: {booking.time}</Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    color="error"
                    fullWidth
                    onClick={() => handleCancelBooking(booking.bookingId)}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default MyBookingsPage
