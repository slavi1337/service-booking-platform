package is.symphony.service_booking_platform.service.impl;

import is.symphony.service_booking_platform.dto.ServiceDto;
import is.symphony.service_booking_platform.model.Role;
import is.symphony.service_booking_platform.model.Service;
import is.symphony.service_booking_platform.model.TimeSlot;
import is.symphony.service_booking_platform.model.User;
import is.symphony.service_booking_platform.repository.ServiceRepository;
import is.symphony.service_booking_platform.repository.TimeSlotRepository;
import is.symphony.service_booking_platform.repository.UserRepository;
import is.symphony.service_booking_platform.service.interfaces.IServiceService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ServiceServiceImpl implements IServiceService {

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final TimeSlotRepository timeSlotRepository;

    @Override
    public Service createService(Service service, Long tenantId) {
        User tenant = userRepository.findById(tenantId)
                .orElseThrow(() -> new EntityNotFoundException("Tenant with ID " + tenantId + " not found."));
        
        if (tenant.getRole() != Role.ROLE_TENANT) {
            throw new IllegalStateException("User must have ROLE_TENANT to create a service.");
        }
        
        service.setProviderTenant(tenant);
        Service savedService = serviceRepository.save(service);

        createInitialTimeSlotsForService(savedService);

        return savedService;
    }

    @Override
    public List<ServiceDto> findAllServices() {
        return serviceRepository.findAll()
                .stream()
                .map(this::mapToServiceDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ServiceDto> findServicesByTenant(Long tenantId) {
        if (!userRepository.existsById(tenantId)) {
            throw new EntityNotFoundException("Tenant with ID " + tenantId + " not found.");
        }
        return serviceRepository.findByProviderTenantId(tenantId)
                .stream()
                .map(this::mapToServiceDto)
                .collect(Collectors.toList());
    }

    @Override
    public ServiceDto findById(Long id) {
        return serviceRepository.findById(id)
                .map(this::mapToServiceDto)
                .orElseThrow(() -> new EntityNotFoundException("Service with ID " + id + " not found."));
    }

    @Override
    public List<ServiceDto> findMyServices(User tenant) {
        return this.findServicesByTenant(tenant.getId());
    }

    private void createInitialTimeSlotsForService(Service service) {
        LocalDate today = LocalDate.now();
        for (int i = 0; i < 6; i++) { 
            LocalDate currentDay = today.plusDays(i);
            for (int hour = 8; hour <= 15; hour++) { 
                LocalDateTime slotTime = currentDay.atTime(hour, 0);
                if (!timeSlotRepository.existsBySlotTimeAndServiceId(slotTime, service.getId())) {
                    TimeSlot newSlot = new TimeSlot(slotTime, service);
                    timeSlotRepository.save(newSlot);
                }
            }
        }
    }

    private ServiceDto mapToServiceDto(Service service) {
        String tenantName = (service.getProviderTenant() != null) ? 
                              (service.getProviderTenant().getBusinessName() != null ? 
                               service.getProviderTenant().getBusinessName() : 
                               service.getProviderTenant().getFirstName()) : 
                              null;

        Long tenantId = (service.getProviderTenant() != null) ? service.getProviderTenant().getId() : null;

        return new ServiceDto(
            service.getId(),
            service.getName(),
            service.getCategory(),
            service.getDescription(),
            service.getPrice(),
            service.getDurationInMinutes(),
            tenantName,
            tenantId
        );
    }
}