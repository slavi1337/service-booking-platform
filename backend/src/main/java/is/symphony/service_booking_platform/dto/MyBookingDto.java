package is.symphony.service_booking_platform.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record MyBookingDto(
        Long bookingId,
        String serviceName,
        String tenantName,
        LocalDate date,
        LocalTime time) {
}