import React, { useState, useEffect, useMemo } from 'react';

import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
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
} from '@mui/material';

import { getMyBookings, cancelBooking } from '../api';

const MyBookingsPage = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('upcoming');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await getMyBookings();
      setAllBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const { upcomingBookings, pastBookings } = useMemo(() => {
    const now = new Date();
    const upcoming = [];
    const past = [];

    allBookings.forEach((booking) => {
      const bookingDateTime = new Date(booking.slotDateTime);

      if (bookingDateTime >= now) {
        upcoming.push(booking);
      } else {
        past.push(booking);
      }
    });

    upcoming.sort((a, b) => new Date(a.slotDateTime) - new Date(b.slotDateTime));
    past.sort((a, b) => new Date(b.slotDateTime) - new Date(a.slotDateTime));

    return { upcomingBookings: upcoming, pastBookings: past };
  }, [allBookings]);

  const bookingsToDisplay = filter === 'upcoming' ? upcomingBookings : pastBookings;

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const handleCancelBooking = async (bookingId) => {

    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId);
        alert('Booking cancelled successfully.');
        fetchBookings();
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.response?.data || 'An error occurred while cancelling.';
        alert(errorMessage);
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography component="h1" gutterBottom variant="h4">
        My Bookings
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
          You do not have any {filter} bookings.
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
                  <Typography color="text.secondary">Provider: {booking.tenantName}</Typography>
                  <Typography sx={{ mt: 1.5 }}>
                    Date: {new Date(booking.slotDateTime).toLocaleDateString()}
                  </Typography>
                  <Typography>
                    Time: {new Date(booking.slotDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </CardContent>

                {filter === 'upcoming' ? <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    color="error"
                    fullWidth
                    onClick={() => handleCancelBooking(booking.bookingId)}
                    variant="outlined"
                  >
                    Cancel Booking
                  </Button>
                </Box> : null}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyBookingsPage;