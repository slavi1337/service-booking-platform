package is.symphony.service_booking_platform.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import is.symphony.service_booking_platform.model.Booking;
import is.symphony.service_booking_platform.model.TimeSlot;
import is.symphony.service_booking_platform.repository.BookingRepository;
import is.symphony.service_booking_platform.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;

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
            throw new IllegalStateException("Ovaj termin je rezervisan. Molimo izaberite drugi.");
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

    @Transactional
    public void cancelBooking(Long bookingId){
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalStateException("Rezervacija sa ID-jem " + bookingId + " ne postoji."));

        
        if (booking.getTimeSlot().getSlotTime().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Ne možete otkazati rezervaciju koja je već prošla.");
        }

        TimeSlot timeSlot=booking.getTimeSlot();
        timeSlot.setBooked(false);
        timeSlotRepository.save(timeSlot);
        bookingRepository.delete(booking);

    }

        @Transactional
    public void updateBookingTimeSlot(Long bookingId, Long newTimeSlotId) {
        
        Booking bookingToUpdate = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Rezervacija sa ID-jem " + bookingId + " ne postoji."));

        
        TimeSlot oldTimeSlot = bookingToUpdate.getTimeSlot();

        TimeSlot newTimeSlot = timeSlotRepository.findById(newTimeSlotId)
                .orElseThrow(() -> new IllegalArgumentException("Novi termin sa ID-jem " + newTimeSlotId + " ne postoji."));
                
        
        if (newTimeSlot.isBooked()) {
            throw new IllegalStateException("Željeni novi termin je upravo rezervisan. Molimo izaberite drugi.");
        }
        
        
        if (newTimeSlot.getSlotTime().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Ne možete promeniti termin na onaj koji je već prošao.");
        }

        
        oldTimeSlot.setBooked(false);
        timeSlotRepository.save(oldTimeSlot);

        
        newTimeSlot.setBooked(true);
        timeSlotRepository.save(newTimeSlot);

        
        bookingToUpdate.setTimeSlot(newTimeSlot);
        bookingRepository.save(bookingToUpdate);
    }
}