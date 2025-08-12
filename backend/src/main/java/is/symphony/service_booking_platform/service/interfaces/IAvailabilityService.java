package is.symphony.service_booking_platform.service.interfaces;

import is.symphony.service_booking_platform.dto.AvailabilityDto;
import java.time.LocalDate;
import java.util.List;

public interface IAvailabilityService {
    List<AvailabilityDto> findAvailableByServiceAndDate(Long serviceId, LocalDate date);
    void toggleAvailability(Long availabilityId, boolean isAvailable);
}