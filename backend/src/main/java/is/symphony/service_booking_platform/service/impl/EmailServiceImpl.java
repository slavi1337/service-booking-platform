package is.symphony.service_booking_platform.service.impl;

import is.symphony.service_booking_platform.service.interfaces.IEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements IEmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendRegistrationConfirmationEmail(String to, String name) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Welcome to Service Booking Platform!");

            String text = String.format(
                    "Hello %s,\n\n" +
                            "Thank you for registering on our platform. We are excited to have you with us!\n\n" +
                            "Best regards,\nThe Service Booking Platform Team",
                    name);
            message.setText(text);

            mailSender.send(message);
            System.out.println("Registration email successfully sent to: " + to);
        } catch (Exception e) {
            System.err.println("Error sending email to " + to + ": " + e.getMessage());
        }
    }

    @Override
    @Async
    public void sendVerificationEmail(String to, String name, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Verify Your Email for Service Booking Platform");

            String verificationUrl = "http://localhost:8080/api/auth/verify?token=" + token;

            String text = String.format(
                    "Hello %s,\n\n" +
                            "Thank you for registering. Please click the link below to verify your email address:\n" +
                            "%s\n\n" +
                            "This link will expire in 24 hours.\n\n" +
                            "Best regards,\nThe Service Booking Platform Team",
                    name, verificationUrl);
            message.setText(text);

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error sending verification email to " + to + ": " + e.getMessage());
        }
    }
}