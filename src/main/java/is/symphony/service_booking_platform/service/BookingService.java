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
                .orElseThrow(() -> new EntityNotFoundException("Termin sa ID-jem " + timeSlotId + " ne postoji."));

        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Klijent sa ID-jem " + clientId + " ne postoji."));

        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new EntityNotFoundException("Usluga sa ID-jem " + serviceId + " ne postoji."));

        if (timeSlot.getSlotTime().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Ne možete rezervisati termin koji je već prošao.");
        }
        if (timeSlot.isBooked()) {
            throw new IllegalStateException("Ovaj termin je već rezervisan. Molimo izaberite drugi.");
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
                .orElseThrow(() -> new EntityNotFoundException("Rezervacija sa ID-jem " + bookingId + " ne postoji."));

        if (booking.getTimeSlot().getSlotTime().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Ne možete otkazati rezervaciju koja je već prošla.");
        }

        TimeSlot timeSlot = booking.getTimeSlot();
        timeSlot.setBooked(false);
        timeSlotRepository.save(timeSlot);
        bookingRepository.delete(booking);
    }

    @Transactional
    public void updateBookingTimeSlot(Long bookingId, Long newTimeSlotId) {
        Booking bookingToUpdate = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Rezervacija sa ID-jem " + bookingId + " ne postoji."));

        TimeSlot newTimeSlot = timeSlotRepository.findById(newTimeSlotId)
                .orElseThrow(() -> new EntityNotFoundException("Novi termin sa ID-jem " + newTimeSlotId + " ne postoji."));

        TimeSlot oldTimeSlot = bookingToUpdate.getTimeSlot();
        
        if (oldTimeSlot.getId().equals(newTimeSlot.getId())) {
            throw new IllegalStateException("Ne možete promeniti termin na onaj koji je već rezervisan.");
        }
        
        if (newTimeSlot.isBooked()) {
            throw new IllegalStateException("Željeni novi termin je već zauzet. Molimo izaberite drugi.");
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

    private TimeSlotDto mapToTimeSlotDto(TimeSlot timeSlot) {
        TimeSlotDto dto = new TimeSlotDto();
        dto.setId(timeSlot.getId());
        dto.setSlotTime(timeSlot.getSlotTime());
        return dto;
    }

    private BookingDetailsDto mapToBookingDetailsDto(Booking booking) {
        BookingDetailsDto dto = new BookingDetailsDto();
        dto.setBookingId(booking.getId());
        
        if (booking.getClient() != null) {
            dto.setClientEmail(booking.getClient().getEmail());
        }
        if (booking.getService() != null) {
            dto.setServiceName(booking.getService().getName());
        }
        if (booking.getTimeSlot() != null) {
            dto.setSlotTime(booking.getTimeSlot().getSlotTime());
        }
        return dto;
    }
}