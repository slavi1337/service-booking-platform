package is.symphony.service_booking_platform.service.interfaces;

import is.symphony.service_booking_platform.dto.BookingDetailsDto;
import is.symphony.service_booking_platform.model.Booking;
import java.time.LocalDate;
import java.util.List;

public interface IBookingService {
    Booking bookTimeSlot(Long availabilityId, Long clientId);
    void cancelBooking(Long bookingId);
    void updateBookingTimeSlot(Long bookingId, Long newAvailabilityId);
    List<BookingDetailsDto> findBookedAppointmentsByDate(LocalDate date);
    BookingDetailsDto findBookingDetailsById(Long bookingId);
}