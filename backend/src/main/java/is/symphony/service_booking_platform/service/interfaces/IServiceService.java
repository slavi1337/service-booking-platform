package is.symphony.service_booking_platform.service.interfaces;

import is.symphony.service_booking_platform.dto.ServiceDto;
import is.symphony.service_booking_platform.model.Service;
import java.util.List;

public interface IServiceService {
    ServiceDto createService(Service service, Long tenantId); 
    List<ServiceDto> findAllServices();
    List<ServiceDto> findServicesByTenant(Long tenantId);
    ServiceDto findById(Long id);
}