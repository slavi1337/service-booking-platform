package is.symphony.service_booking_platform.repository;

import is.symphony.service_booking_platform.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

List<Appointment> findByBookingTimeBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);
}