package is.symphony.service_booking_platform.controller;

import is.symphony.service_booking_platform.service.BookingService;
import jakarta.persistence.EntityNotFoundException;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService; 

    @GetMapping("/slots/available")
    public ResponseEntity<?> getAvailableSlots(@RequestParam String date) {
        return ResponseEntity.ok(bookingService.findAvailableTimeSlotsByDate(LocalDate.parse(date)));
    }
    
    @PostMapping("/slots/{id}/book")
    public ResponseEntity<?> bookSlot(
            @PathVariable("id") Long timeSlotId, 
            @RequestBody BookingRequest request) {
        try {
            bookingService.bookTimeSlot(timeSlotId, request.getClientId(), request.getServiceId());
            return ResponseEntity.status(HttpStatus.CREATED).body("Termin je uspešno rezervisan.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping("/bookings")
    public ResponseEntity<?> getBookedAppointments(@RequestParam String date) {
        return ResponseEntity.ok(bookingService.findBookedAppointmentsByDate(LocalDate.parse(date)));
    }
    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable("id") Long bookingId) {
        try {
            bookingService.cancelBooking(bookingId);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException | IllegalStateException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/bookings/{id}")
    public ResponseEntity<String> updateBooking(
            @PathVariable("id") Long bookingId,
            @RequestBody UpdateBookingRequest request) {
        try {
            bookingService.updateBookingTimeSlot(bookingId, request.getNewTimeSlotId());
            return ResponseEntity.ok("Termin je uspešno promenjen.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @Data
    static class BookingRequest {
        private Long clientId;
        private Long serviceId;
    }
    
    @Data
    static class UpdateBookingRequest {
        private Long newTimeSlotId;
    }
}