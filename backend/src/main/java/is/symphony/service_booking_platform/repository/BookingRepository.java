package is.symphony.service_booking_platform.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import is.symphony.service_booking_platform.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

        @Query("SELECT b FROM Booking b " +
                        "JOIN FETCH b.availability a " +
                        "JOIN FETCH a.template t " +
                        "WHERE a.date = :targetDate")
        List<Booking> findBookingsByDate(@Param("targetDate") LocalDate targetDate);

        Optional<Booking> findByAvailabilityId(Long availabilityId);

        List<Booking> findByClientIdOrderByAvailabilityDateDescAvailabilityTemplateStartTimeDesc(Long clientId);

        List<Booking> findByClientId(Long clientId);

        void deleteByAvailability_ServiceId(Long serviceId);

        @Query("SELECT b FROM Booking b " +
                        "JOIN b.availability a " +
                        "WHERE a.isBooked = true AND b.reminderSent = false AND " +
                        "FUNCTION('TIMESTAMP', a.date, a.template.startTime) BETWEEN :from AND :to")
        List<Booking> findUpcomingBookingsForReminder(
                        @Param("from") LocalDateTime from,
                        @Param("to") LocalDateTime to);

        void deleteByClientId(Long clientId);

}