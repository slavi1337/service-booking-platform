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
  CssBaseline,
} from '@mui/material'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  getServiceById,
  getAllSlotStatusesForService,
  createBooking,
  getBookingDetails,
  toggleAvailability,
  cancelBookingByTenant,
} from '../api'
import { useAuth } from '../context/AuthContext'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './CalendarStyles.css'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  maxWidth: '90%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
}

const ServiceDetailsPage = () => {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [service, setService] = useState(null)
  const [slots, setSlots] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [loadingService, setLoadingService] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(true)
  const [error, setError] = useState(null)

  const [selectedSlot, setSelectedSlot] = useState(null)
  const [bookingDetails, setBookingDetails] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const fetchServiceDetails = async () => {
      setLoadingService(true)
      try {
        const response = await getServiceById(serviceId)
        setService(response.data)
      } catch (err) {
        setError('Failed to fetch service details.')
      } finally {
        setLoadingService(false)
      }
    }
    fetchServiceDetails()
  }, [serviceId])

  const fetchAllSlots = async () => {
    if (!serviceId) return
    setLoadingSlots(true)
    try {
      const formatDateForAPI = (date) => {
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
      }

      const dateString = formatDateForAPI(selectedDate)

      const response = await getAllSlotStatusesForService(serviceId, dateString)
      setSlots(response.data)
    } catch (err) {
      setError('Failed to fetch slots for this date.')
    } finally {
      setLoadingSlots(false)
    }
  }

  useEffect(() => {
    fetchAllSlots()
  }, [selectedDate, serviceId])

  const handleSlotClick = async (slot) => {
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }

    setSelectedSlot(slot)
    setBookingError('')
    setBookingDetails(null)

    if (user.role === 'ROLE_TENANT' && slot.isBooked && slot.bookingId) {
      try {
        const response = await getBookingDetails(slot.bookingId)
        setBookingDetails(response.data)
      } catch (err) {
        setBookingError('Could not fetch booking details.')
      }
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => setIsModalOpen(false)

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !user) return
    setBookingError('')
    try {
      const bookingData = { availabilityId: selectedSlot.id, clientId: user.id }
      await createBooking(bookingData)
      setSuccessMessage(`Successfully booked appointment!`)
      handleCloseModal()
      await fetchAllSlots()
    } catch (err) {
      setBookingError(
        err.response?.data?.message || err.response?.data || 'An error occurred while booking.',
      )
    }
  }

  const handleToggleAvailability = async (slot) => {
    if (!slot) return

    const newAvailabilityStatus = !slot.isAvailable
    try {
      await toggleAvailability(slot.id, newAvailabilityStatus)

      setSlots((currentSlots) =>
        currentSlots.map((s) =>
          s.id === slot.id ? { ...s, isAvailable: newAvailabilityStatus } : s,
        ),
      )
      handleCloseModal()
    } catch (err) {
      setBookingError('Failed to update slot status. It might be already booked.')
    }
  }

  const handleTenantCancelBooking = async (bookingId) => {
    if (!bookingId) return

    if (window.confirm("Are you sure you want to cancel this user's booking?")) {
      try {
        await cancelBookingByTenant(bookingId)
        setSuccessMessage('Booking successfully cancelled.')
        handleCloseModal()
        await fetchAllSlots()
      } catch (err) {
        setBookingError('Failed to cancel booking.')
        console.error(err)
      }
    }
  }

  if (loadingService)
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
  if (!service)
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 4 }}>
          Service not found.
        </Alert>
      </Container>
    )

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: 'url(/login.jpeg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        py: 4,
      }}
    >
      <Container>
        <Paper sx={{ p: 3, my: 4 }}>
          <Typography variant="h4" component="h1">
            {service.name}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {service.category}
          </Typography>
          <Typography variant="body1" sx={{ my: 2 }}>
            {service.description}
          </Typography>
          <Typography variant="h5">Price: {service.price.toFixed(2)}€</Typography>
          <Typography variant="body1">Duration: {service.durationInMinutes} minutes</Typography>
        </Paper>

        <Box>
          <Typography variant="h5" gutterBottom>
            Available Appointments
          </Typography>

          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  minDate={new Date()}
                  tileDisabled={({ date, view }) =>
                    view === 'month' && date < new Date().setHours(0, 0, 0, 0)
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">
                Slots for {selectedDate.toLocaleDateString('en-GB')}:
              </Typography>

              <Box
                sx={{
                  minHeight: 200,
                  mt: 2,
                  p: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                {loadingSlots ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <Grid container spacing={1}>
                    {slots.length > 0 ? (
                      slots.map((slot) => {
                        const isBooked = slot.isBooked
                        const isUnavailable = !slot.isAvailable
                        const isDisabledForUser =
                          user?.role === 'ROLE_USER' && (isBooked || isUnavailable)

                        let buttonVariant = 'outlined'
                        let buttonColor = 'primary'
                        if (isBooked) {
                          buttonVariant = 'contained'
                          buttonColor = 'error'
                        } else if (isUnavailable) {
                          buttonVariant = 'contained'
                          buttonColor = 'inherit'
                        }

                        return (
                          <Grid item key={slot.id}>
                            <Button
                              variant={buttonVariant}
                              color={buttonColor}
                              disabled={isDisabledForUser}
                              onClick={() => handleSlotClick(slot)}
                            >
                              {new Date(slot.startTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Button>
                          </Grid>
                        )
                      })
                    ) : (
                      <Typography sx={{ p: 2 }}>
                        No slots available for the selected date.
                      </Typography>
                    )}
                  </Grid>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Modal open={isModalOpen} onClose={handleCloseModal} aria-labelledby="modal-title">
          <Box sx={modalStyle}>
            {user?.role === 'ROLE_USER' && selectedSlot && (
              <>
                <Typography id="modal-title" variant="h6" component="h2">
                  Booking Confirmation
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  Are you sure you want to book <strong>"{service.name}"</strong> at{' '}
                  <strong>
                    {new Date(selectedSlot.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </strong>
                  ?
                </Typography>

                {bookingError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {bookingError}
                  </Alert>
                )}

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button onClick={handleCloseModal}>Cancel</Button>
                  <Button variant="contained" onClick={handleConfirmBooking}>
                    Confirm
                  </Button>
                </Box>
              </>
            )}

            {user?.role === 'ROLE_TENANT' && selectedSlot && (
              <>
                <Typography id="modal-title" variant="h6" component="h2">
                  Slot Details
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  <strong>Time:</strong>{' '}
                  {new Date(selectedSlot.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>

                {selectedSlot.isBooked ? (
                  <Box sx={{ mt: 1 }}>
                    <Typography color="error">
                      <strong>Status: Booked</strong>
                    </Typography>
                    {bookingDetails ? (
                      <>
                        <Typography>
                          <strong>Client:</strong> {bookingDetails.clientFirstName}{' '}
                          {bookingDetails.clientLastName}
                        </Typography>
                        <Typography>
                          <strong>Email:</strong> {bookingDetails.clientEmail}
                        </Typography>

                        <Button
                          variant="contained"
                          color="warning"
                          sx={{ mt: 2 }}
                          onClick={() => handleTenantCancelBooking(bookingDetails.bookingId)}
                        >
                          Cancel This Booking
                        </Button>
                      </>
                    ) : bookingError ? (
                      <Alert severity="error">{bookingError}</Alert>
                    ) : (
                      <CircularProgress size={20} sx={{ mt: 1 }} />
                    )}
                  </Box>
                ) : (
                  <Box sx={{ mt: 1 }}>
                    <Typography>
                      <strong>Status:</strong>{' '}
                      {selectedSlot.isAvailable ? 'Available' : 'Unavailable by You'}
                    </Typography>
                    <Button
                      variant="outlined"
                      sx={{ mt: 2 }}
                      onClick={() => handleToggleAvailability(selectedSlot)}
                      color={selectedSlot.isAvailable ? 'warning' : 'success'}
                    >
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

        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage('')}
          message={successMessage}
        />
      </Container>
    </Box>
  )
}

export default ServiceDetailsPage
