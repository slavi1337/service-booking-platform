package is.symphony.service_booking_platform.service;

import is.symphony.service_booking_platform.model.Booking;
import is.symphony.service_booking_platform.model.TimeSlot;
import is.symphony.service_booking_platform.repository.BookingRepository;
import is.symphony.service_booking_platform.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final TimeSlotRepository timeSlotRepository;
    private final BookingRepository bookingRepository;

    public List<TimeSlot> findAvailableTimeSlotsByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        return timeSlotRepository.findBySlotTimeBetweenAndIsBookedFalse(startOfDay, endOfDay);
    }

    @Transactional
    public Booking bookTimeSlot(Long timeSlotId, String clientEmail, String serviceName) {
        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId)
                .orElseThrow(() -> new IllegalStateException("Termin sa ID-jem " + timeSlotId + " ne postoji."));

        if (timeSlot.getSlotTime().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Ne možete rezervisati termin koji je već prošao.");
        }

        if (timeSlot.isBooked()) {
            throw new IllegalStateException("Ovaj termin je upravo rezervisan. Molimo izaberite drugi.");
        }

        timeSlot.setBooked(true);
        timeSlotRepository.save(timeSlot);

        Booking newBooking = new Booking();
        newBooking.setClientEmail(clientEmail);
        newBooking.setServiceName(serviceName);
        newBooking.setTimeSlot(timeSlot);

        return bookingRepository.save(newBooking);
    }

    public List<Booking> findBookedAppointmentsByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        return bookingRepository.findBookingsBetween(startOfDay, endOfDay);
    }
}