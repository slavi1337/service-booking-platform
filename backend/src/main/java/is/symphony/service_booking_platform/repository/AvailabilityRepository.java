package is.symphony.service_booking_platform.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import is.symphony.service_booking_platform.model.Availability;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    
    List<Availability> findByServiceIdAndDateAndIsAvailableTrueAndIsBookedFalseOrderByTemplateStartTimeAsc(Long serviceId, LocalDate date);
    List<Availability> findByServiceIdAndDateAndIsAvailableTrueOrderByTemplateStartTimeAsc(Long serviceId, LocalDate date);
}