package is.symphony.service_booking_platform.repository;

import is.symphony.service_booking_platform.model.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    boolean existsBySlotTimeAndServiceId(LocalDateTime slotTime, Long serviceId);

    List<TimeSlot> findBySlotTimeBetweenAndServiceIdAndIsBookedFalse(
        LocalDateTime start, 
        LocalDateTime end, 
        Long serviceId
    );
}