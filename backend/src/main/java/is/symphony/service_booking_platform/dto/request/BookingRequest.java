package is.symphony.service_booking_platform.dto.request;

import lombok.Data;

@Data
public class BookingRequest {
    private Long clientId;
    private Long serviceId;
}