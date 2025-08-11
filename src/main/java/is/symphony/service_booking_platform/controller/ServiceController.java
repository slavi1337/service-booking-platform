package is.symphony.service_booking_platform.controller;

import is.symphony.service_booking_platform.dto.ServiceDto;
import is.symphony.service_booking_platform.model.Service;
import is.symphony.service_booking_platform.service.ServiceService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import is.symphony.service_booking_platform.model.User;
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

    @GetMapping
    public ResponseEntity<List<ServiceDto>> getAllServices() {
        List<ServiceDto> services = serviceService.findAllServices();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/my-services")
    public ResponseEntity<List<ServiceDto>> getMyServices(Authentication authentication) {
        User loggedInUser = (User) authentication.getPrincipal();

        List<ServiceDto> services = serviceService.findServicesByTenant(loggedInUser.getId());
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{id}")
public ResponseEntity<ServiceDto> getServiceById(@PathVariable Long id) {
    ServiceDto service = serviceService.findById(id); 
    return ResponseEntity.ok(service);
}
}
