package is.symphony.service_booking_platform.service;

import is.symphony.service_booking_platform.model.Appointment;
import is.symphony.service_booking_platform.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public Appointment createAppointment(Appointment appointmentRequest) {
        LocalDateTime requestedTime = appointmentRequest.getBookingTime();

        // Da li je vrijeme na pun sat (npr. 8:00, 9:00)?
        if (requestedTime.getMinute() != 0 || requestedTime.getSecond() != 0 || requestedTime.getNano() != 0) {
            throw new IllegalArgumentException("Rezervacije su moguce samo na pun sat (npr. 09:00, 10:00)");
        }

        // Da li je vrijeme u okviru radnog vremena (8 termina od 8:00 do 15:00)?
        int hour = requestedTime.getHour();
        if (hour < 8 || hour > 15) { // Dozvoljeni sati su 8, 9, 10, 11, 12, 13, 14, 15 (ukupno 8)
            throw new IllegalArgumentException("Radno vrijeme je od 08:00 do 16:00. Poslednji termin je u 15:00.");
        }

        // Provjeri da li je ukupan broj rezervacija za taj dan manji od 8 
        LocalDate requestedDate = requestedTime.toLocalDate();
        LocalDateTime startOfDay = requestedDate.atStartOfDay();
        LocalDateTime endOfDay = requestedDate.atTime(LocalTime.MAX);
        
        List<Appointment> todaysBookings = appointmentRepository.findByBookingTimeBetween(startOfDay, endOfDay);

        // Provjera da li je terminvec zauzet
        boolean isSlotTaken = todaysBookings.stream()
                .anyMatch(booking -> booking.getBookingTime().isEqual(requestedTime));
        if (isSlotTaken) {
            throw new IllegalStateException("Ovaj termin je vec zauzet. Molimo izaberite drugi.");
        }

        // provjera da li je appointment u narednih 7 dana inace ne moze da se rezervise
        LocalDate today = LocalDate.now();
        if (requestedDate.isBefore(today) || requestedDate.isAfter(today.plusDays(7))) {
            throw new IllegalArgumentException("Termin može biti rezervisan samo za narednih 7 dana.");
        }

        // sacvaj rezervaciju u bazi podataka
        return appointmentRepository.save(appointmentRequest);
    }
}