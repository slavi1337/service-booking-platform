package is.symphony.service_booking_platform.service.interfaces;

import is.symphony.service_booking_platform.dto.TenantDto;
import java.util.List;

public interface IUserService {
    List<TenantDto> findAllTenants();
}