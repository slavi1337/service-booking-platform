package is.symphony.service_booking_platform.dto;

import java.time.LocalDateTime;
public record TimeSlotDto(Long id, LocalDateTime slotTime, boolean isBooked) {}
