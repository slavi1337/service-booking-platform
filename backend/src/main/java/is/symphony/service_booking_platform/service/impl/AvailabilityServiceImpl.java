package is.symphony.service_booking_platform.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import is.symphony.service_booking_platform.dto.AvailabilityDto;
import is.symphony.service_booking_platform.dto.AvailabilityStatusDto;
import is.symphony.service_booking_platform.model.Availability;
import is.symphony.service_booking_platform.repository.AvailabilityRepository;
import is.symphony.service_booking_platform.service.interfaces.IAvailabilityService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AvailabilityServiceImpl implements IAvailabilityService {

    private final AvailabilityRepository availabilityRepository;

    @Override
    public List<AvailabilityDto> findAvailableByServiceAndDate(Long serviceId, LocalDate date) {
        return availabilityRepository.findByServiceIdAndDateAndIsAvailableTrueAndIsBookedFalseOrderByTemplateStartTimeAsc(serviceId, date)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public void toggleAvailability(Long availabilityId, boolean isAvailable) {
        Availability availability = availabilityRepository.findById(availabilityId).orElseThrow(/*...*/);
        availability.setAvailable(isAvailable);
        availabilityRepository.save(availability);
    }

    @Override
    public List<AvailabilityStatusDto> findAllByServiceAndDate(Long serviceId, LocalDate date) {
        return availabilityRepository.findByServiceIdAndDateAndIsAvailableTrueOrderByTemplateStartTimeAsc(serviceId, date)
                .stream()
                .map(this::mapToStatusDto) 
                .collect(Collectors.toList());
    }

    private AvailabilityDto mapToDto(Availability availability) {
        LocalDateTime dateTime = LocalDateTime.of(
            availability.getDate(),
            availability.getTemplate().getStartTime()
        );

        return new AvailabilityDto(availability.getId(), dateTime);
    }

    private AvailabilityStatusDto mapToStatusDto(Availability availability) {
        LocalDateTime dateTime = LocalDateTime.of(
            availability.getDate(),
            availability.getTemplate().getStartTime()
        );
        return new AvailabilityStatusDto(
            availability.getId(), 
            dateTime, 
            availability.isBooked()
        );
    }
}