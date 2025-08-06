package is.symphony.service_booking_platform.repository;

import is.symphony.service_booking_platform.model.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    boolean existsBySlotTime(LocalDateTime slotTime);
    List<TimeSlot> findBySlotTimeBetweenAndIsBookedFalse(LocalDateTime start, LocalDateTime end);
}