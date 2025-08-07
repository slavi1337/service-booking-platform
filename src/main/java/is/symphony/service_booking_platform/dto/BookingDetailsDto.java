package is.symphony.service_booking_platform.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class BookingDetailsDto {
    private Long bookingId; 
    private String clientEmail;
    private String serviceName;
    private LocalDateTime slotTime;
}
