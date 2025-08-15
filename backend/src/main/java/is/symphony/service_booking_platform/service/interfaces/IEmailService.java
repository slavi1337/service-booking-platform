package is.symphony.service_booking_platform.service.interfaces;

public interface IEmailService {
    void sendVerificationEmail(String to, String name, String token);
}