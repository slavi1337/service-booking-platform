// LOKACIJA: service/impl/BookingServiceImpl.java
package is.symphony.service_booking_platform.service.impl;

import is.symphony.service_booking_platform.dto.BookingDetailsDto;
import is.symphony.service_booking_platform.model.*;
import is.symphony.service_booking_platform.repository.*;
import is.symphony.service_booking_platform.service.interfaces.IBookingService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements IBookingService {
    
    private final BookingRepository bookingRepository;
    private final AvailabilityRepository availabilityRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Booking bookTimeSlot(Long availabilityId, Long clientId) {
        Availability availability = availabilityRepository.findById(availabilityId)
                .orElseThrow(() -> new EntityNotFoundException("Availability with ID " + availabilityId + " not found."));
        
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Client with ID " + clientId + " not found."));
        
        if (!availability.isAvailable() || availability.isBooked()) {
            throw new IllegalStateException("This time slot is not available for booking.");
        }
        
        LocalDateTime slotDateTime = LocalDateTime.of(availability.getDate(), availability.getTemplate().getStartTime());
        if (slotDateTime.isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot book a time slot that has already passed.");
        }

        availability.setBooked(true);
        availabilityRepository.save(availability);
        
        Booking newBooking = new Booking();
        newBooking.setClient(client);
        newBooking.setAvailability(availability);
        return bookingRepository.save(newBooking);
    }
    
    @Override
    public List<BookingDetailsDto> findBookedAppointmentsByDate(LocalDate date) {
        return List.of(); 
    }

    @Override
    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking with ID " + bookingId + " not found."));

        Availability availability = booking.getAvailability();
        availability.setBooked(false);
        availabilityRepository.save(availability);
        bookingRepository.delete(booking);
    }

    @Override
    @Transactional
    public void updateBookingTimeSlot(Long bookingId, Long newAvailabilityId) {
        Booking bookingToUpdate = bookingRepository.findById(bookingId).orElseThrow(/*...*/);
        Availability newAvailability = availabilityRepository.findById(newAvailabilityId).orElseThrow(/*...*/);
        
        if (!newAvailability.isAvailable() || newAvailability.isBooked()) {
            throw new IllegalStateException("New time slot is not available.");
        }

        Availability oldAvailability = bookingToUpdate.getAvailability();
        oldAvailability.setBooked(false);
        availabilityRepository.save(oldAvailability);

        newAvailability.setBooked(true);
        availabilityRepository.save(newAvailability);
        
        bookingToUpdate.setAvailability(newAvailability);
        bookingRepository.save(bookingToUpdate);
    }
}