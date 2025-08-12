import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, CircularProgress, Alert, Paper, Grid,
  Button, Modal, Snackbar, TextField
} from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getServiceById, getAllSlotStatusesForService, createBooking, getBookingDetails, toggleAvailability } from '../api';
import { useAuth } from '../context/AuthContext';

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 450, maxWidth: '90%', bgcolor: 'background.paper', border: '2px solid #000',
  boxShadow: 24, p: 4, borderRadius: 2,
};

const ServiceDetailsPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loadingService, setLoadingService] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchServiceDetails = async () => {
      setLoadingService(true);
      try {
        const response = await getServiceById(serviceId);
        setService(response.data);
      } catch (err) { setError('Failed to fetch service details.'); }
      finally { setLoadingService(false); }
    };
    fetchServiceDetails();
  }, [serviceId]);

  const fetchAllSlots = async () => {
    if (!serviceId) return;
    setLoadingSlots(true);
    try {
      const response = await getAllSlotStatusesForService(serviceId, selectedDate);
      setSlots(response.data);
    } catch (err) { setError('Failed to fetch slots for this date.'); }
    finally { setLoadingSlots(false); }
  };

  useEffect(() => {
    fetchAllSlots();
  }, [selectedDate, serviceId]);

  const handleSlotClick = async (slot) => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    
    setSelectedSlot(slot);
    setBookingError('');
    setBookingDetails(null);

    if (user.role === 'ROLE_TENANT' && slot.isBooked && slot.bookingId) {
        try {
            const response = await getBookingDetails(slot.bookingId);
            setBookingDetails(response.data);
        } catch (err) {
            setBookingError("Could not fetch booking details.");
        }
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !user) return;
    setBookingError('');
    try {
      const bookingData = { availabilityId: selectedSlot.id, clientId: user.id };
      await createBooking(bookingData);
      setSuccessMessage(`Successfully booked appointment!`);
      handleCloseModal();
      await fetchAllSlots(); // Osveži listu slotova
    } catch (err) {
      setBookingError(err.response?.data?.message || err.response?.data || 'An error occurred while booking.');
    }
  };

  const handleToggleAvailability = async (slot) => {
        if (!slot) return;
        
        const newAvailabilityStatus = !slot.isAvailable;
        try {
            await toggleAvailability(slot.id, newAvailabilityStatus);

            // Ažuriraj stanje lokalno za trenutan feedback korisniku
            setSlots(currentSlots => 
                currentSlots.map(s => 
                    s.id === slot.id ? { ...s, isAvailable: newAvailabilityStatus } : s
                )
            );
            handleCloseModal(); // Zatvori modal nakon akcije

        } catch (err) {
            setBookingError("Failed to update slot status. It might be already booked.");
            // Ne zatvaramo modal da korisnik vidi grešku
        }
    };

  if (loadingService) return <Container sx={{ textAlign: 'center', mt: 5 }}><CircularProgress /></Container>;
  if (error) return <Container><Alert severity="error" sx={{ mt: 4 }}>{error}</Alert></Container>;
  if (!service) return <Container><Alert severity="warning" sx={{ mt: 4 }}>Service not found.</Alert></Container>;

  return (
    <Container>
      <Paper sx={{ p: 3, my: 4 }}>
        <Typography variant="h4" component="h1">{service.name}</Typography>
        <Typography variant="h6" color="text.secondary">{service.category}</Typography>
        <Typography variant="body1" sx={{ my: 2 }}>{service.description}</Typography>
        <Typography variant="h5">Price: {service.price.toFixed(2)}€</Typography>
        <Typography variant="body1">Duration: {service.durationInMinutes} minutes</Typography>
      </Paper>

      <Box>
        <Typography variant="h5" gutterBottom>Available Slots</Typography>
        <TextField id="date" label="Select Date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} InputLabelProps={{ shrink: true }}/>
        
        {loadingSlots ? <CircularProgress sx={{ display: 'block', mt: 2 }} /> : (
          <Grid container spacing={1} sx={{ mt: 2 }}>
            {slots.length > 0 ? (
              slots.map((slot) => {
                const isBooked = slot.isBooked;
                const isUnavailable = !slot.isAvailable;
                const isDisabledForUser = user?.role === 'ROLE_USER' && (isBooked || isUnavailable);
                
                let buttonVariant = 'outlined';
                let buttonColor = 'primary';
                if (isBooked) {
                    buttonVariant = 'contained';
                    buttonColor = 'error';
                } else if (isUnavailable) {
                    buttonVariant = 'contained';
                    buttonColor = 'inherit';
                }

                return (
                  <Grid item key={slot.id}>
                    <Button
                      variant={buttonVariant}
                      color={buttonColor}
                      disabled={isDisabledForUser}
                      onClick={() => handleSlotClick(slot)}
                    >
                      {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Button>
                  </Grid>
                );
              })
            ) : <Typography sx={{ ml: 1, mt: 2 }}>No slots available for the selected date.</Typography>}
          </Grid>
        )}
      </Box>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          {user?.role === 'ROLE_USER' && selectedSlot && (
            <>
              <Typography variant="h6">Booking Confirmation</Typography>
              <Typography sx={{ mt: 2 }}>
                Are you sure you want to book <strong>"{service.name}"</strong> at <strong>{new Date(selectedSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>?
              </Typography>
              {bookingError && <Alert severity="error" sx={{ mt: 2 }}>{bookingError}</Alert>}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button variant="contained" onClick={handleConfirmBooking}>Confirm</Button>
              </Box>
            </>
          )}
          {user?.role === 'ROLE_TENANT' && selectedSlot && (
            <>
              <Typography variant="h6">Slot Details</Typography>
              <Typography sx={{ mt: 2 }}><strong>Time:</strong> {new Date(selectedSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
              {selectedSlot.isBooked ? (
                <Box sx={{ mt: 1 }}>
                  <Typography color="error"><strong>Status: Booked</strong></Typography>
                  {bookingDetails ? (
                    <>
                      <Typography><strong>Client:</strong> {bookingDetails.clientFirstName} {bookingDetails.clientLastName}</Typography>
                      <Typography><strong>Email:</strong> {bookingDetails.clientEmail}</Typography>
                    </>
                  ) : bookingError ? <Alert severity="error">{bookingError}</Alert> : <CircularProgress size={20} />}
                </Box>
              ) : (
                <Box sx={{ mt: 1 }}>
                  <Typography><strong>Status:</strong> {selectedSlot.isAvailable ? 'Available' : 'Unavailable by You'}</Typography>
                  <Button variant="outlined" sx={{ mt: 2 }} onClick={() => handleToggleAvailability(selectedSlot)}
                                    color={selectedSlot.isAvailable ? 'warning' : 'success'}>
                    {selectedSlot.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                  </Button>
                </Box>
              )}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleCloseModal}>Close</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
      
      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage('')} message={successMessage} />
    </Container>
  );
};

export default ServiceDetailsPage;