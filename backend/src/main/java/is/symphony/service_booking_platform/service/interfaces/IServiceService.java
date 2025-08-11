package is.symphony.service_booking_platform.service.interfaces;

import is.symphony.service_booking_platform.dto.ServiceDto;
import is.symphony.service_booking_platform.model.User;
import is.symphony.service_booking_platform.model.Service;
import java.util.List;

public interface IServiceService {
    Service createService(Service service, Long tenantId);
    List<ServiceDto> findAllServices();
    List<ServiceDto> findServicesByTenant(Long tenantId);
    ServiceDto findById(Long id);
    List<ServiceDto> findMyServices(User tenant);
}