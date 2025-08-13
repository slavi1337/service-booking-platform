package is.symphony.service_booking_platform.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

import is.symphony.service_booking_platform.dto.BookingDetailsDto;
import is.symphony.service_booking_platform.dto.MyBookingDto;
import is.symphony.service_booking_platform.model.Availability;
import is.symphony.service_booking_platform.model.Booking;
import is.symphony.service_booking_platform.model.Service;
import is.symphony.service_booking_platform.model.TimeTemplate;
import is.symphony.service_booking_platform.model.User;
import is.symphony.service_booking_platform.repository.AvailabilityRepository;
import is.symphony.service_booking_platform.repository.BookingRepository;
import is.symphony.service_booking_platform.repository.UserRepository;
import is.symphony.service_booking_platform.service.interfaces.IBookingService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class BookingServiceImpl implements IBookingService {

    private final BookingRepository bookingRepository;
    private final AvailabilityRepository availabilityRepository;
    private final UserRepository userRepository;

    public BookingDetailsDto findBookingDetailsById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking with ID " + bookingId + " not found."));
        return this.mapToBookingDetailsDto(booking);
    }

    public BookingDetailsDto mapToBookingDetailsDto(Booking booking) {
        User client = booking.getClient();
        Availability availability = booking.getAvailability();
        Service service = (availability != null) ? availability.getService() : null;
        TimeTemplate template = (availability != null) ? availability.getTemplate() : null;
        LocalDate date = (availability != null) ? availability.getDate() : null;

        LocalDateTime slotDateTime = (date != null && template != null)
                ? LocalDateTime.of(date, template.getStartTime())
                : null;

        return new BookingDetailsDto(
                booking.getId(),
                client != null ? client.getId() : null,
                client != null ? client.getFirstName() : null,
                client != null ? client.getLastName() : null,
                client != null ? client.getEmail() : null,
                service != null ? service.getName() : null,
                slotDateTime);
    }

    @Override
    @Transactional
    public Booking bookTimeSlot(Long availabilityId, Long clientId) {
        Availability availability = availabilityRepository.findById(availabilityId)
                .orElseThrow(
                        () -> new EntityNotFoundException("Availability with ID " + availabilityId + " not found."));

        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Client with ID " + clientId + " not found."));

        if (!availability.isAvailable() || availability.isBooked()) {
            throw new IllegalStateException("This time slot is not available for booking.");
        }

        LocalDateTime slotDateTime = LocalDateTime.of(availability.getDate(),
                availability.getTemplate().getStartTime());
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
        List<Booking> bookings = bookingRepository.findBookingsByDate(date);
        return bookings.stream()
                .map(this::mapToBookingDetailsDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking ..."));

        Availability availability = booking.getAvailability();
        LocalDateTime slotDateTime = LocalDateTime.of(availability.getDate(),
                availability.getTemplate().getStartTime());
        if (slotDateTime.isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot cancel a booking that has already passed");
        }

        availability.setBooked(false);
        availabilityRepository.save(availability);
        bookingRepository.delete(booking);
    }

    @Override
    @Transactional
    public void updateBookingTimeSlot(Long bookingId, Long newAvailabilityId) {
        /* posije dodati */
        Booking bookingToUpdate = bookingRepository.findById(bookingId).orElseThrow(/* ... */);
        Availability newAvailability = availabilityRepository.findById(newAvailabilityId).orElseThrow(/* ... */);

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

    @Override
    public List<MyBookingDto> findBookingsByClientId(Long clientId) {
        List<Booking> bookings = bookingRepository
                .findByClientIdOrderByAvailabilityDateDescAvailabilityTemplateStartTimeDesc(clientId);

        return bookings.stream()
                .map(this::mapToMyBookingDto)
                .collect(Collectors.toList());
    }

    private MyBookingDto mapToMyBookingDto(Booking booking) {
        Availability availability = booking.getAvailability();
        Service service = availability.getService();
        User tenant = service.getProviderTenant();

        String tenantName = tenant.getBusinessName() != null && !tenant.getBusinessName().isEmpty()
                ? tenant.getBusinessName()
                : tenant.getFirstName() + " " + tenant.getLastName();

        return new MyBookingDto(
                booking.getId(),
                service.getName(),
                tenantName,
                availability.getDate(),
                availability.getTemplate().getStartTime());
    }

    @Override
    @Transactional
    public void cancelBookingByTenant(Long bookingId, User tenant) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking with ID " + bookingId + " not found."));

        Long tenantIdFromBooking = booking.getAvailability().getService().getProviderTenant().getId();
        if (!tenantIdFromBooking.equals(tenant.getId())) {
            throw new SecurityException("Tenant does not have permission to cancel this booking.");
        }

        Availability availability = booking.getAvailability();
        availability.setBooked(false);
        availabilityRepository.save(availability);
        bookingRepository.delete(booking);
    }

    @Override
    public List<BookingDetailsDto> findMyBookings(User client) {
        return bookingRepository.findByClientId(client.getId())
                .stream()
                .map(this::mapToBookingDetailsDto)
                .collect(Collectors.toList());
    }
}