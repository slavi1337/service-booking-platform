package is.symphony.service_booking_platform.dto;

import java.time.LocalDateTime;

public record AvailabilityDto(
        Long id,
        LocalDateTime startTime) {
}