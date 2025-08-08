package is.symphony.service_booking_platform.service;

import java.util.List;
import java.util.stream.Collectors;

import is.symphony.service_booking_platform.dto.ServiceDto;
import is.symphony.service_booking_platform.model.Role;
import is.symphony.service_booking_platform.model.Service;
import is.symphony.service_booking_platform.model.User;
import is.symphony.service_booking_platform.repository.ServiceRepository;
import is.symphony.service_booking_platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    public Service createService(Service service, Long tenantId) {
        User tenant = userRepository.findById(tenantId)
                .orElseThrow(() -> new IllegalStateException("Tenant " + tenantId + " not found."));

        if (tenant.getRole() != Role.ROLE_TENANT) {
            throw new IllegalStateException("User must have TENANT role to create a service.");
        }
        
        service.setProviderTenant(tenant);
        return serviceRepository.save(service);
    }

    public List<ServiceDto> findAllServices() {
        return serviceRepository.findAll()
                .stream()
                .map(this::mapToServiceDto)
                .collect(Collectors.toList());
    }

     private ServiceDto mapToServiceDto(Service service) {
        ServiceDto dto = new ServiceDto();
        dto.setId(service.getId());
        dto.setName(service.getName());
        dto.setCategory(service.getCategory());
        dto.setDescription(service.getDescription());
        dto.setPrice(service.getPrice());
        dto.setDurationInMinutes(service.getDurationInMinutes());
        if (service.getProviderTenant() != null) {
            dto.setTenantName(service.getProviderTenant().getFirstName() + " " + service.getProviderTenant().getLastName());
        }
        return dto;
    }
}