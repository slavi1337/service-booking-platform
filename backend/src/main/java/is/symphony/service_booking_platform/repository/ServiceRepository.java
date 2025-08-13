package is.symphony.service_booking_platform.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import is.symphony.service_booking_platform.model.Service;

public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByProviderTenantId(Long tenantId);

      @Query("SELECT DISTINCT s.category FROM Service s ORDER BY s.category")
    List<String> findDistinctCategories();

    List<Service> findByCategory(String category);
}
