package is.symphony.service_booking_platform.controller;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import is.symphony.service_booking_platform.dto.AvailabilityDto;
import is.symphony.service_booking_platform.dto.AvailabilityStatusDto;
import is.symphony.service_booking_platform.service.interfaces.IAvailabilityService;
import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/api/availabilities")
@RequiredArgsConstructor
public class AvailabilityController {

    private final IAvailabilityService availabilityService;

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<?> getAvailableByServiceAndDate(
            @PathVariable Long serviceId,
            @RequestParam String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            List<AvailabilityDto> availableSlots = availabilityService.findAvailableByServiceAndDate(serviceId, localDate);
            return ResponseEntity.ok(availableSlots);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body("Invalid date format. Please use YYYY-MM-DD.");
        }
    }

    @GetMapping("/service/{serviceId}/all-slots")
    public ResponseEntity<?> getAllByServiceAndDate(
            @PathVariable Long serviceId,
            @RequestParam String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            
            List<AvailabilityStatusDto> allSlots = availabilityService.findAllByServiceAndDate(serviceId, localDate);
            return ResponseEntity.ok(allSlots);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body("Invalid date format. Please use YYYY-MM-DD.");
        }
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Void> toggleAvailability(
            @PathVariable("id") Long availabilityId,
            @RequestParam boolean isAvailable) {
        availabilityService.toggleAvailability(availabilityId, isAvailable);
        return ResponseEntity.ok().build();
    }
}