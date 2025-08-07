package is.symphony.service_booking_platform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import is.symphony.service_booking_platform.model.Service;

public interface ServiceRepository extends JpaRepository<Service, Long> {
    
}
