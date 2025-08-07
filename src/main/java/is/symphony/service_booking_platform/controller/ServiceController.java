package is.symphony.service_booking_platform.controller;

import is.symphony.service_booking_platform.model.Service;
import is.symphony.service_booking_platform.service.ServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    @PostMapping
    public ResponseEntity<?> createService(@RequestBody Service service, @RequestParam Long tenantId) {
        try {
            Service createdService = serviceService.createService(service, tenantId);
            return new ResponseEntity<>(createdService, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
