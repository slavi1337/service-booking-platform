package is.symphony.service_booking_platform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import is.symphony.service_booking_platform.model.Service;
import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByProviderTenantId(Long tenantId);
}
