package is.symphony.service_booking_platform.service.interfaces;

import is.symphony.service_booking_platform.dto.BookingDetailsDto;
import is.symphony.service_booking_platform.model.Booking;

import java.time.LocalDate;
import java.util.List;

public interface IBookingService {
    Booking bookTimeSlot(Long timeSlotId, Long clientId, Long serviceId);
    void cancelBooking(Long bookingId);
    void updateBookingTimeSlot(Long bookingId, Long newTimeSlotId);
    List<BookingDetailsDto> findBookedAppointmentsByDate(LocalDate date);
}