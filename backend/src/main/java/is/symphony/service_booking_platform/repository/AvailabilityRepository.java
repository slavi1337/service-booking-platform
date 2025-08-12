package is.symphony.service_booking_platform.repository;

import is.symphony.service_booking_platform.model.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    
    List<Availability> findByServiceIdAndDateAndIsAvailableTrueAndIsBookedFalseOrderByTemplateStartTimeAsc(Long serviceId, LocalDate date);
}