package is.symphony.service_booking_platform.repository;

import is.symphony.service_booking_platform.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    @Query("SELECT b FROM Booking b " +
           "JOIN FETCH b.availability a " +
           "JOIN FETCH a.template t " +
           "WHERE a.date = :targetDate")
    List<Booking> findBookingsByDate(@Param("targetDate") LocalDate targetDate);
}