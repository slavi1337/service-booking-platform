package is.symphony.service_booking_platform.dto;

import java.time.LocalDateTime;

public record BookingDetailsDto(
    Long bookingId, 
    Long clientId,
    String clientFirstName,
    String clientLastName,
    String clientEmail,
    String serviceName,
    LocalDateTime slotDateTime
) {}
