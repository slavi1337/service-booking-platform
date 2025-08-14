package is.symphony.service_booking_platform.service.interfaces;

import java.util.List;

import is.symphony.service_booking_platform.dto.CategoryDto;
import is.symphony.service_booking_platform.dto.ServiceCardDto;
import is.symphony.service_booking_platform.dto.ServiceDto;
import is.symphony.service_booking_platform.dto.request.ServiceUpdateRequest;
import is.symphony.service_booking_platform.model.Service;
import is.symphony.service_booking_platform.model.User;

public interface IServiceService {
    ServiceDto createService(Service service, Long tenantId);

    List<ServiceDto> findAllServices();

    List<ServiceDto> findServicesByTenant(Long tenantId);

    ServiceDto findById(Long id);

    List<CategoryDto> findAllDistinctCategories();

    List<ServiceCardDto> findServicesByCategory(String category);

    void deleteService(Long serviceId, User tenant);

    ServiceDto updateService(Long serviceId, ServiceUpdateRequest request, User tenant);
}