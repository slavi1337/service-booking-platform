package is.symphony.service_booking_platform.repository;

import is.symphony.service_booking_platform.model.TimeTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeTemplateRepository extends JpaRepository<TimeTemplate, Long> {
}