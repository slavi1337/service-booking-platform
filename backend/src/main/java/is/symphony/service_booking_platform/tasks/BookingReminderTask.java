package is.symphony.service_booking_platform.tasks;

import is.symphony.service_booking_platform.model.Booking;
import is.symphony.service_booking_platform.repository.BookingRepository;
import is.symphony.service_booking_platform.service.interfaces.IEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class BookingReminderTask {

    private final BookingRepository bookingRepository;
    private final IEmailService emailService;

    @Scheduled(fixedRate = 600000)
    public void sendReminders() {
        System.out.println("Running booking reminder task...");

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime reminderWindowStart = now.plusMinutes(30);
        LocalDateTime reminderWindowEnd = now.plusMinutes(40);

        List<Booking> bookingsToSendReminder = bookingRepository.findUpcomingBookingsForReminder(
                reminderWindowStart,
                reminderWindowEnd);

        if (bookingsToSendReminder.isEmpty()) {
            System.out.println("No upcoming bookings found for reminders in the current window.");
            return;
        }

        System.out.println("Found " + bookingsToSendReminder.size() + " booking(s) to send reminders for.");

        for (Booking booking : bookingsToSendReminder) {
            emailService.sendBookingReminderEmail(booking);
            booking.setReminderSent(true);
            bookingRepository.save(booking);
        }
    }
}