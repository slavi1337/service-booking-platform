package is.symphony.service_booking_platform.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import is.symphony.service_booking_platform.model.Booking;
import is.symphony.service_booking_platform.model.TimeSlot;
import is.symphony.service_booking_platform.service.BookingService;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping("/slots/available")
    public ResponseEntity<?> getAvailableSlots(@RequestParam String date) {
        LocalDate requestedDate;
        try {
            requestedDate = LocalDate.parse(date);
        } catch (java.time.format.DateTimeParseException e) {
            return ResponseEntity.badRequest().body("Format datuma nije ispravan. Koristite format GGGG-MM-DD.");
        }

        LocalDate today = LocalDate.now();
        LocalDate lastAvailableDate = today.plusDays(6); 

        if (requestedDate.isBefore(today) || requestedDate.isAfter(lastAvailableDate)) {
            return ResponseEntity.badRequest().body("Možete pregledati termine samo za narednih 7 dana.");
        }

        List<TimeSlot> availableSlots = bookingService.findAvailableTimeSlotsByDate(requestedDate);
        return ResponseEntity.ok(availableSlots);
    }
    
    @PostMapping("/slots/{id}/book")
    public ResponseEntity<String> bookSlot(
            @PathVariable("id") Long timeSlotId, 
            @RequestBody BookingRequest request) {
        try {
            bookingService.bookTimeSlot(timeSlotId, request.getClientEmail(), request.getServiceName());
            return ResponseEntity.ok("Termin je uspješno rezervisan.");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping("/bookings")
    public ResponseEntity<?> getBookedAppointments(@RequestParam String date) {
        LocalDate requestedDate;
        try {
            requestedDate = LocalDate.parse(date);
        } catch (java.time.format.DateTimeParseException e) {
            return ResponseEntity.badRequest().body("Format datuma nije ispravan. Koristite format GGGG-MM-DD.");
        }
        
        List<Booking> bookedAppointments = bookingService.findBookedAppointmentsByDate(requestedDate);
        return ResponseEntity.ok(bookedAppointments);
    }

    @Data
    static class BookingRequest {
        private String clientEmail;
        private String serviceName;
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<String> cancelBooking(@PathVariable("id")Long bookingId){
        try {
            bookingService.cancelBooking(bookingId);
            return ResponseEntity.ok("Rezervacija je uspjesno otkazana");
        } catch ( IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

        @PatchMapping("/bookings/{id}")
    public ResponseEntity<String> updateBooking(
            @PathVariable("id") Long bookingId,
            @RequestBody UpdateBookingRequest request) {
        try {
            bookingService.updateBookingTimeSlot(bookingId, request.getNewTimeSlotId());
            return ResponseEntity.ok("Termin je uspješno promijenjen.");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (IllegalArgumentException e) { 
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @Data
    static class UpdateBookingRequest {
        private Long newTimeSlotId;
    }
    
}