package is.symphony.service_booking_platform.service.impl;

import is.symphony.service_booking_platform.dto.TimeSlotDto;
import is.symphony.service_booking_platform.model.TimeSlot;
import is.symphony.service_booking_platform.repository.TimeSlotRepository;
import is.symphony.service_booking_platform.service.interfaces.ITimeSlotService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TimeSlotServiceImpl implements ITimeSlotService {

    private final TimeSlotRepository timeSlotRepository;

    @Override
    public List<TimeSlotDto> findAvailableTimeSlotsByDate(LocalDate date, Long serviceId) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
         List<TimeSlot> timeSlots = timeSlotRepository.findBySlotTimeBetweenAndServiceIdAndIsBookedFalse(startOfDay, endOfDay, serviceId);
         return timeSlots.stream().map(this::mapToTimeSlotDto).collect(Collectors.toList());
    }

     private TimeSlotDto mapToTimeSlotDto(TimeSlot timeSlot) {
        return new TimeSlotDto(
        timeSlot.getId(), 
        timeSlot.getSlotTime(), 
        timeSlot.isBooked()
    );
    }
}

