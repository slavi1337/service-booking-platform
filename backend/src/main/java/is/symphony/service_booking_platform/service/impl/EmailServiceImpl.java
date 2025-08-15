package is.symphony.service_booking_platform.service.impl;

import is.symphony.service_booking_platform.model.Booking;
import is.symphony.service_booking_platform.service.interfaces.IEmailService;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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

    @Override
    @Async
    public void sendBookingConfirmationEmail(Booking booking) {
        if (booking == null || booking.getClient() == null || booking.getAvailability() == null) {
            System.err.println("Cannot send confirmation email: Booking data is incomplete.");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(booking.getClient().getEmail());
            message.setSubject("Booking Confirmation: " + booking.getAvailability().getService().getName());

            LocalDateTime dateTime = LocalDateTime.of(
                    booking.getAvailability().getDate(),
                    booking.getAvailability().getTemplate().getStartTime());
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, dd MMMM yyyy 'at' HH:mm");

            String text = String.format(
                    "Dear %s,\n\n" +
                            "Your booking has been successfully confirmed.\n\n" +
                            "--- Booking Details ---\n" +
                            "Service: %s\n" +
                            "Provider: %s\n" +
                            "Date & Time: %s\n\n" +
                            "We look forward to seeing you!\n\n" +
                            "Best regards,\nThe Service Booking Platform Team",
                    booking.getClient().getFirstName(),
                    booking.getAvailability().getService().getName(),
                    booking.getAvailability().getService().getProviderTenant().getBusinessName(),
                    dateTime.format(formatter));
            message.setText(text);

            mailSender.send(message);
            System.out.println("Booking confirmation email successfully sent to: " + booking.getClient().getEmail());
        } catch (Exception e) {
            System.err.println("Error sending booking confirmation email: " + e.getMessage());
        }
    }
}