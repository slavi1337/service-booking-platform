package is.symphony.service_booking_platform.service.interfaces;

import java.time.LocalDate;
import java.util.List;

import is.symphony.service_booking_platform.dto.BookingDetailsDto;
import is.symphony.service_booking_platform.dto.MyBookingDto;
import is.symphony.service_booking_platform.model.Booking;
public interface IBookingService {
    Booking bookTimeSlot(Long availabilityId, Long clientId);
    void cancelBooking(Long bookingId);
    void updateBookingTimeSlot(Long bookingId, Long newAvailabilityId);
    List<BookingDetailsDto> findBookedAppointmentsByDate(LocalDate date);
    BookingDetailsDto findBookingDetailsById(Long bookingId);
    List<MyBookingDto> findBookingsByClientId(Long clientId);
}