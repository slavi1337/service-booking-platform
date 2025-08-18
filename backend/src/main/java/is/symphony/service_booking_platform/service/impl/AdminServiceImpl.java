package is.symphony.service_booking_platform.service.impl;

import is.symphony.service_booking_platform.exception.ResourceNotFoundException;
import is.symphony.service_booking_platform.model.Role;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import is.symphony.service_booking_platform.model.User;
import is.symphony.service_booking_platform.repository.BookingRepository;
import is.symphony.service_booking_platform.repository.ServiceRepository;
import is.symphony.service_booking_platform.repository.UserRepository;
import java.util.List;
import java.util.stream.Collectors;
import is.symphony.service_booking_platform.dto.UserDto;
import is.symphony.service_booking_platform.service.interfaces.IAdminService;
import is.symphony.service_booking_platform.repository.AvailabilityRepository;
import is.symphony.service_booking_platform.model.Service;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class AdminServiceImpl implements IAdminService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final AvailabilityRepository availabilityRepository;

    @Override
    public List<UserDto> findAllUsers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() != Role.ROLE_ADMIN)
                .map(this::mapToUserDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void toggleUserLock(Long userId, boolean lockStatus) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with ID " + userId + " not found."));
        user.setAccountLocked(lockStatus);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with ID " + userId + " not found."));

        if (user.getRole() == Role.ROLE_TENANT) {
            List<Service> services = serviceRepository.findByProviderTenantId(user.getId());
            for (Service service : services) {
                bookingRepository.deleteByAvailability_ServiceId(service.getId());
                availabilityRepository.deleteByServiceId(service.getId());
            }
            serviceRepository.deleteAll(services);
        } else if (user.getRole() == Role.ROLE_USER) {
            bookingRepository.deleteByClientId(user.getId());
        }

        userRepository.delete(user);
    }

    private UserDto mapToUserDto(User user) {
        return new UserDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getBusinessName(),
                user.getEmail(),
                user.getRole().name(),
                user.isEnabled(),
                user.isAccountNonLocked());
    }
}