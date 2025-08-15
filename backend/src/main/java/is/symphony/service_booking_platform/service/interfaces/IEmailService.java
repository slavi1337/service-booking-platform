package is.symphony.service_booking_platform.service.interfaces;

import is.symphony.service_booking_platform.model.Booking;

public interface IEmailService {
    void sendVerificationEmail(String to, String name, String token);

    void sendBookingConfirmationEmail(Booking booking);

    void sendBookingReminderEmail(Booking booking);
}