package is.symphony.service_booking_platform.repository;

import is.symphony.service_booking_platform.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b JOIN FETCH b.timeSlot ts WHERE ts.slotTime BETWEEN :start AND :end")
    List<Booking> findBookingsBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

}