package is.symphony.service_booking_platform.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import is.symphony.service_booking_platform.model.Service;

public interface ServiceRepository extends JpaRepository<Service, Long> {
  List<Service> findByProviderTenantId(Long tenantId);

  List<Service> findByCategory_Name(String categoryName);
}
