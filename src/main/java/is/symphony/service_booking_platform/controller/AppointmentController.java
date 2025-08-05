package is.symphony.service_booking_platform.controller;

import is.symphony.service_booking_platform.model.Appointment;
import is.symphony.service_booking_platform.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<String> createAppointment(@RequestBody Appointment appointmentRequest) {
        try {
            Appointment createdAppointment = appointmentService.createAppointment(appointmentRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body("Termin je uspješno rezervisan. ID: " + createdAppointment.getId());
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}