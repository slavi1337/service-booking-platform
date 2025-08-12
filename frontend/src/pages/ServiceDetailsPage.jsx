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
  Modal,
  Snackbar,
  TextField,
} from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'

import { getServiceById, getAvailableSlotsForService, createBooking } from '../api'
import { useAuth } from '../context/AuthContext';

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 'auto', maxWidth: '90%', bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4,
};

const ServiceDetailsPage = () => {
  const { serviceId } = useParams()
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null)
  const [slots, setSlots] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loadingService, setLoadingService] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchServiceDetails = async () => {
      setLoadingService(true);
      try {
        const response = await getServiceById(serviceId)
        setService(response.data)
      } catch (err) {
        setError('Failed to fetch service details.')
      }
      finally {
        setLoadingService(false)
      }
    }
    fetchServiceDetails()
  }, [serviceId])

  useEffect(() => {
    if (!serviceId) return;
    const fetchSlots = async () => {
      setLoadingSlots(true)
      setError(null)
      try {
        const response = await getAvailableSlotsForService(serviceId, selectedDate);
        //console.log("Podaci dobijeni sa servera:", response.data);
        setSlots(response.data)
      } catch (err) {
        setError('Failed to fetch available slots.')
      } finally {
        setLoadingSlots(false)
      }
    }
    fetchSlots()
  }, [selectedDate, serviceId])

  const handleOpenModal = (slot) => {
        if (!user) {
            navigate('/login', { state: { from: location } }); // Preusmeri na login ako nije ulogovan
            return;
        }
        if (user.role !== 'ROLE_USER') {
            alert("Only users can book appointments.");
            return;
        }
        setSelectedSlot(slot);
        setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleConfirmBooking = async () => {
        if (!selectedSlot || !user) return;
        setBookingError('');
        try {
            const bookingData = { 
                availabilityId: selectedSlot.id, 
                clientId: user.id 
            };
            await createBooking(bookingData);
            
            setSuccessMessage(`Successfully booked appointment on ${new Date(selectedSlot.startTime).toLocaleString()}`);
            handleCloseModal();
            const response = await getAvailableSlotsForService(serviceId, selectedDate);
            setSlots(response.data);
        } catch (err) {
            setBookingError(err.response?.data?.message || "An error occurred while booking the appointment.");
        }
    };

  if (loadingService) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  }
  if (!service) {
    return <Alert severity="warning" sx={{ m: 4 }}>Service not found.</Alert>;
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
  }

  return (
    <Container>
      <Paper sx={{ p: 3, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {service.name}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {service.category}
        </Typography>
        <Typography variant="body1" sx={{ my: 2 }}>
          {service.description}
        </Typography>
        <Typography variant="h5">Price: {service.price}€</Typography>
        <Typography variant="body1">Duration: {service.durationInMinutes} minutes</Typography>
      </Paper>

      <Box>
        <Typography variant="h5" gutterBottom>
          Available Appointments
        </Typography>
        <TextField
          id="date"
          label="Select Date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        {loadingSlots ? ( 
          <CircularProgress sx={{ display: 'block', mt: 2 }} />
        ) : (
          <Grid container spacing={1} sx={{ mt: 2 }}>
            {slots.length > 0 ? (
              slots.map((slot) => (
                <Grid item key={slot.id}>
                  <Button variant="outlined" onClick={() => handleOpenModal(slot)}>
                    {new Date(slot.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Button>
                </Grid>
              ))
            ) : (
              <Typography sx={{ ml: 1, mt: 1 }}>No available slots for this date.</Typography>
            )}
          </Grid>
        )}
      </Box>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="booking-confirmation-title"
      >
        <Box sx={modalStyle}>
          <Typography id="booking-confirmation-title" variant="h6" component="h2">
            Confirm Booking
          </Typography>
          {selectedSlot && (
            <Typography sx={{ mt: 2 }}>
              Are you sure you want to book the service 
              <strong> "{service?.name}"</strong> at 
              <strong> {new Date(selectedSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>?
            </Typography>
          )}
          {bookingError && <Alert severity="error" sx={{ mt: 2 }}>{bookingError}</Alert>}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button variant="contained" onClick={handleConfirmBooking}>
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
      
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
      />
    </Container>
  )
}

export default ServiceDetailsPage
