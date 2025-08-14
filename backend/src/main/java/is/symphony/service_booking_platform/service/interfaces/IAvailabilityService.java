package is.symphony.service_booking_platform.service.interfaces;

import java.time.LocalDate;
import java.util.List;

import is.symphony.service_booking_platform.dto.AvailabilityDto;
import is.symphony.service_booking_platform.dto.AvailabilityStatusDto;
import is.symphony.service_booking_platform.model.User;

public interface IAvailabilityService {
    List<AvailabilityDto> findAvailableByServiceAndDate(Long serviceId, LocalDate date);

    void toggleAvailability(Long availabilityId, boolean isAvailable, User tenant);

    List<AvailabilityStatusDto> findAllByServiceAndDate(Long serviceId, LocalDate date);
}