package is.symphony.service_booking_platform.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TimeSlotDto {
    private Long id;
    private LocalDateTime slotTime;
    private boolean isBooked;
}
