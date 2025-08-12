package is.symphony.service_booking_platform.controller;

import is.symphony.service_booking_platform.dto.BookingDetailsDto;
import is.symphony.service_booking_platform.dto.request.BookingRequest;
import is.symphony.service_booking_platform.dto.request.UpdateBookingRequest;
import is.symphony.service_booking_platform.service.interfaces.IBookingService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final IBookingService bookingService; 

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            bookingService.bookTimeSlot(request.availabilityId(), request.clientId());
            return ResponseEntity.status(HttpStatus.CREATED).body("Successfully booked the time slot.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getBookedAppointments(@RequestParam String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            List<BookingDetailsDto> bookings = bookingService.findBookedAppointmentsByDate(localDate);
            return ResponseEntity.ok(bookings);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body("Invalid date format.");
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable("id") Long bookingId) {
        try {
            bookingService.cancelBooking(bookingId);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException | IllegalStateException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<String> updateBooking(
            @PathVariable("id") Long bookingId,
            @RequestBody UpdateBookingRequest request) {
        try {
            bookingService.updateBookingTimeSlot(bookingId, request.newAvailabilityId());
            return ResponseEntity.ok("Successfully updated the booking.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
}