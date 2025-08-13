package is.symphony.service_booking_platform.dto;

import java.time.LocalDateTime;

public record AvailabilityStatusDto(
        Long id,
        LocalDateTime startTime,
        boolean isBooked,
        boolean isAvailable,
        Long bookingId) {
}
