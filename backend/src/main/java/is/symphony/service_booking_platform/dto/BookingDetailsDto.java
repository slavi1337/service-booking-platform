package is.symphony.service_booking_platform.dto;

import java.time.LocalDateTime;

public record BookingDetailsDto(
    Long bookingId, 
    String clientEmail, 
    String serviceName, 
    LocalDateTime slotTime
) {}
