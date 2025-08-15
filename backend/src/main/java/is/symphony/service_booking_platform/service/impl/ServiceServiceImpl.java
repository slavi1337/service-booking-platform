package is.symphony.service_booking_platform.service.impl;

import is.symphony.service_booking_platform.dto.CategoryDto;
import is.symphony.service_booking_platform.dto.ServiceCardDto;
import is.symphony.service_booking_platform.dto.ServiceDto;
import is.symphony.service_booking_platform.dto.request.ServiceUpdateRequest;
import is.symphony.service_booking_platform.model.Service;
import is.symphony.service_booking_platform.model.User;
import is.symphony.service_booking_platform.model.Availability;
import is.symphony.service_booking_platform.model.TimeTemplate;
import is.symphony.service_booking_platform.model.Role;
import is.symphony.service_booking_platform.repository.ServiceRepository;
import is.symphony.service_booking_platform.repository.UserRepository;
import is.symphony.service_booking_platform.repository.AvailabilityRepository;
import is.symphony.service_booking_platform.repository.TimeTemplateRepository;
import is.symphony.service_booking_platform.service.interfaces.IServiceService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import is.symphony.service_booking_platform.repository.BookingRepository;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceServiceImpl implements IServiceService {

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final AvailabilityRepository availabilityRepository;
    private final TimeTemplateRepository timeTemplateRepository;
    private final BookingRepository bookingRepository;

    @Override
    @Transactional
    public ServiceDto createService(Service service, Long tenantId) {
        User tenant = userRepository.findById(tenantId)
                .orElseThrow(() -> new EntityNotFoundException("Tenant with ID " + tenantId + " not found."));

        if (tenant.getRole() != Role.ROLE_TENANT) {
            throw new IllegalStateException("User must have ROLE_TENANT to create a service.");
        }

        service.setProviderTenant(tenant);
        Service savedService = serviceRepository.save(service);
        createInitialAvailabilitiesForService(savedService);

        return mapToServiceDto(savedService);
    }

    private void createInitialAvailabilitiesForService(Service service) {
        List<TimeTemplate> templates = timeTemplateRepository.findAll();
        LocalDate today = LocalDate.now();

        for (int i = 0; i < 7; i++) {
            LocalDate currentDay = today.plusDays(i);
            for (TimeTemplate template : templates) {
                Availability availability = new Availability();
                availability.setService(service);
                availability.setTemplate(template);
                availability.setDate(currentDay);
                availabilityRepository.save(availability);
            }
        }
    }

    @Override
    public List<ServiceDto> findAllServices() {
        return serviceRepository.findAll().stream().map(this::mapToServiceDto).collect(Collectors.toList());
    }

    @Override
    public List<ServiceDto> findServicesByTenant(Long tenantId) {
        if (!userRepository.existsById(tenantId)) {
            throw new EntityNotFoundException("Tenant with ID " + tenantId + " not found.");
        }
        return serviceRepository.findByProviderTenantId(tenantId).stream().map(this::mapToServiceDto)
                .collect(Collectors.toList());
    }

    @Override
    public ServiceDto findById(Long id) {
        return serviceRepository.findById(id).map(this::mapToServiceDto)
                .orElseThrow(() -> new EntityNotFoundException("Service with ID " + id + " not found."));
    }

    private ServiceDto mapToServiceDto(Service service) {
        User tenant = service.getProviderTenant();
        String tenantName = (tenant != null) ? tenant.getBusinessName() : null;
        Long tenantId = (tenant != null) ? tenant.getId() : null;

        return new ServiceDto(
                service.getId(), service.getName(), service.getCategory(), service.getDescription(),
                service.getPrice(), service.getDurationInMinutes(), tenantName, tenantId);
    }

    @Override
    public List<CategoryDto> findAllDistinctCategories() {
        return serviceRepository.findDistinctCategories().stream()
                .map(CategoryDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<ServiceCardDto> findServicesByCategory(String category) {
        return serviceRepository.findByCategory(category).stream()
                .map(this::mapToServiceCardDto)
                .collect(Collectors.toList());
    }

    private ServiceCardDto mapToServiceCardDto(Service service) {
        User tenant = service.getProviderTenant();
        String tenantName = tenant.getBusinessName() != null && !tenant.getBusinessName().isEmpty()
                ? tenant.getBusinessName()
                : tenant.getFirstName() + " " + tenant.getLastName();

        return new ServiceCardDto(
                service.getId(),
                service.getName(),
                tenantName,
                service.getPrice(),
                service.getDurationInMinutes());
    }

    @Override
    @Transactional
    public void deleteService(Long serviceId, User tenant) {
        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new EntityNotFoundException("Service with ID " + serviceId + " not found."));

        if (!service.getProviderTenant().getId().equals(tenant.getId())) {
            throw new SecurityException("Tenant does not have permission to delete this service.");
        }

        bookingRepository.deleteByAvailability_ServiceId(serviceId);
        availabilityRepository.deleteByServiceId(serviceId);

        serviceRepository.delete(service);
    }

    @Override
    @Transactional
    public ServiceDto updateService(Long serviceId, ServiceUpdateRequest request, User tenant) {
        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new EntityNotFoundException("Service with ID " + serviceId + " not found."));

        if (!service.getProviderTenant().getId().equals(tenant.getId())) {
            throw new SecurityException("Tenant does not have permission to edit this service.");
        }

        service.setName(request.name());
        service.setCategory(request.category());
        service.setDescription(request.description());
        service.setPrice(request.price());
        service.setDurationInMinutes(request.durationInMinutes());

        Service updatedService = serviceRepository.save(service);
        return mapToServiceDto(updatedService);
    }
}