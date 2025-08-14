package is.symphony.service_booking_platform.controller;

import is.symphony.service_booking_platform.dto.ServiceDto;
import is.symphony.service_booking_platform.model.Service;
import is.symphony.service_booking_platform.model.User;
import is.symphony.service_booking_platform.service.interfaces.IServiceService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final IServiceService serviceService;

    @PostMapping
    public ResponseEntity<?> createService(@RequestBody Service service, Authentication authentication) {
        try {
            User loggedInUser = (User) authentication.getPrincipal();
            ServiceDto createdService = serviceService.createService(service, loggedInUser.getId());
            return new ResponseEntity<>(createdService, HttpStatus.CREATED);
        } catch (EntityNotFoundException | IllegalStateException e) {
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
        return ResponseEntity.ok(serviceService.findServicesByTenant(loggedInUser.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceDto> getServiceById(@PathVariable Long id) {
        ServiceDto service = serviceService.findById(id);
        return ResponseEntity.ok(service);
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<ServiceDto>> getServicesByTenant(@PathVariable Long tenantId) {
        List<ServiceDto> services = serviceService.findServicesByTenant(tenantId);
        return ResponseEntity.ok(services);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(
            @PathVariable("id") Long serviceId,
            Authentication authentication) {
        try {
            User loggedInTenant = (User) authentication.getPrincipal();
            serviceService.deleteService(serviceId, loggedInTenant);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}