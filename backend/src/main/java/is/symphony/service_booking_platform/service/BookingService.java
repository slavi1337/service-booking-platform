package is.symphony.service_booking_platform.service;

import is.symphony.service_booking_platform.dto.BookingDetailsDto;
import is.symphony.service_booking_platform.dto.TimeSlotDto;
import is.symphony.service_booking_platform.model.Booking;
import is.symphony.service_booking_platform.model.Service;
import is.symphony.service_booking_platform.model.TimeSlot;
import is.symphony.service_booking_platform.model.User;
import is.symphony.service_booking_platform.repository.BookingRepository;
import is.symphony.service_booking_platform.repository.ServiceRepository;
import is.symphony.service_booking_platform.repository.TimeSlotRepository;
import is.symphony.service_booking_platform.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class BookingService {

    private final TimeSlotRepository timeSlotRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    public List<TimeSlotDto> findAvailableTimeSlotsByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        List<TimeSlot> timeSlots = timeSlotRepository.findBySlotTimeBetweenAndIsBookedFalse(startOfDay, endOfDay);
        return timeSlots.stream().map(this::mapToTimeSlotDto).collect(Collectors.toList());
    }

    public List<BookingDetailsDto> findBookedAppointmentsByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        List<Booking> bookings = bookingRepository.findBookingsBetween(startOfDay, endOfDay);
        return bookings.stream().map(this::mapToBookingDetailsDto).collect(Collectors.toList());
    }

    @Transactional
    public Booking bookTimeSlot(Long timeSlotId, Long clientId, Long serviceId) {
        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId)
                .orElseThrow(() -> new EntityNotFoundException("Time slot " + timeSlotId + " not found."));

        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Client " + clientId + " not found."));

        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new EntityNotFoundException("Service " + serviceId + " not found."));

        if (timeSlot.getSlotTime().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot book a time slot that has already passed.");
        }
        if (timeSlot.isBooked()) {
            throw new IllegalStateException("This time slot is already booked. Please choose another.");
        }

        timeSlot.setBooked(true);
        timeSlotRepository.save(timeSlot);

        Booking newBooking = new Booking();
        newBooking.setClient(client);
        newBooking.setService(service);
        newBooking.setTimeSlot(timeSlot);

        return bookingRepository.save(newBooking);
    }

    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking " + bookingId + " not found."));

        if (booking.getTimeSlot().getSlotTime().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot cancel a booking that has already passed.");
        }

        TimeSlot timeSlot = booking.getTimeSlot();
        timeSlot.setBooked(false);
        timeSlotRepository.save(timeSlot);
        bookingRepository.delete(booking);
    }

    @Transactional
    public void updateBookingTimeSlot(Long bookingId, Long newTimeSlotId) {
        Booking bookingToUpdate = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking " + bookingId + " not found."));

        TimeSlot newTimeSlot = timeSlotRepository.findById(newTimeSlotId)
                .orElseThrow(() -> new EntityNotFoundException("New time slot " + newTimeSlotId + " not found."));

        TimeSlot oldTimeSlot = bookingToUpdate.getTimeSlot();
        
        if (oldTimeSlot.getId().equals(newTimeSlot.getId())) {
            throw new IllegalStateException("Cannot change the time slot to one that is already booked.");
        }
        
        if (newTimeSlot.isBooked()) {
            throw new IllegalStateException("Desired new time slot is already booked. Please choose another.");
        }
        
        if (newTimeSlot.getSlotTime().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot change the time slot to one that has already passed.");
        }

        oldTimeSlot.setBooked(false);
        timeSlotRepository.save(oldTimeSlot);

        newTimeSlot.setBooked(true);
        timeSlotRepository.save(newTimeSlot);

        bookingToUpdate.setTimeSlot(newTimeSlot);
        bookingRepository.save(bookingToUpdate);
    }

    private TimeSlotDto mapToTimeSlotDto(TimeSlot timeSlot) {
        return new TimeSlotDto(
        timeSlot.getId(), 
        timeSlot.getSlotTime(), 
        timeSlot.isBooked()
    );
    }

    private BookingDetailsDto mapToBookingDetailsDto(Booking booking) {
        return new BookingDetailsDto(
        booking.getId(),
        booking.getClient() != null ? booking.getClient().getEmail() : null,
        booking.getService() != null ? booking.getService().getName() : null,
        booking.getTimeSlot() != null ? booking.getTimeSlot().getSlotTime() : null
    );
    }
}