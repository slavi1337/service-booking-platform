package is.symphony.service_booking_platform.service.interfaces;

import is.symphony.service_booking_platform.dto.TimeSlotDto;
import java.time.LocalDate;
import java.util.List;

public interface ITimeSlotService {
    List<TimeSlotDto> findAvailableTimeSlotsByDate(LocalDate date, Long tenantId);
}