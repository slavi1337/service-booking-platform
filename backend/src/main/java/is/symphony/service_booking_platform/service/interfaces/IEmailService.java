package is.symphony.service_booking_platform.service.interfaces;

public interface IEmailService {
    void sendRegistrationConfirmationEmail(String to, String name);
}