import React, { useState, useEffect, useMemo } from 'react'

import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import EventBusyIcon from '@mui/icons-material/EventBusy'
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
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'

import { getMyBookings, cancelBooking } from '../api'

const MyBookingsPage = () => {
  const [allBookings, setAllBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [filter, setFilter] = useState('upcoming')

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await getMyBookings()
      setAllBookings(response.data)
    } catch (err) {
      setError('Failed to fetch reservation')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const { upcomingBookings, pastBookings } = useMemo(() => {
    const now = new Date()
    const upcoming = []
    const past = []

    allBookings.forEach((booking) => {
      const [hours, minutes] = booking.time.split(':')
      const bookingDateTime = new Date(booking.date)
      bookingDateTime.setHours(hours, minutes)

      if (bookingDateTime >= now) {
        upcoming.push(booking)
      } else {
        past.push(booking)
      }
    })

    upcoming.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
    past.sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time))

    return { upcomingBookings: upcoming, pastBookings: past }
  }, [allBookings])

  const bookingsToDisplay = filter === 'upcoming' ? upcomingBookings : pastBookings

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter)
    }
  }

  const handleCancelBooking = async (bookingId, bookingDate, bookingTime) => {
    const [hours, minutes] = bookingTime.split(':')
    const bookingDateTime = new Date(bookingDate)
    bookingDateTime.setHours(hours, minutes)

    if (bookingDateTime < new Date()) {
      alert('Cannot cancel booking that has already passed ')
      return
    }

    if (window.confirm('Are you sure that you want to cancel?')) {
      try {
        await cancelBooking(bookingId)
        alert('Reservation cancelled successfully')
        fetchBookings()
      } catch (err) {
        alert('An error occurred during reservation')
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography component="h1" gutterBottom variant="h4">
        My Reservations
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <ToggleButtonGroup
          aria-label="Filter bookings"
          color="primary"
          exclusive
          onChange={handleFilterChange}
          value={filter}
        >
          <ToggleButton aria-label="upcoming bookings" value="upcoming">
            <EventAvailableIcon sx={{ mr: 1 }} />
            Upcoming
          </ToggleButton>
          <ToggleButton aria-label="past bookings" value="past">
            <EventBusyIcon sx={{ mr: 1 }} />
            Past
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {bookingsToDisplay.length === 0 ? (
        <Typography sx={{ textAlign: 'center', mt: 4 }}>
          You do not have any {filter === 'upcoming' ? 'upcoming' : 'past'} reservations.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {bookingsToDisplay.map((booking) => (
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
                  <Typography>Time: {booking.time.substring(0, 5)}</Typography>
                </CardContent>

                {filter === 'upcoming' ? (
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
                ) : null}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default MyBookingsPage
