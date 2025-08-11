package is.symphony.service_booking_platform.service.impl;

import is.symphony.service_booking_platform.dto.TenantDto;
import is.symphony.service_booking_platform.model.Role;
import is.symphony.service_booking_platform.model.User;
import is.symphony.service_booking_platform.repository.UserRepository;
import is.symphony.service_booking_platform.service.interfaces.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;

    @Override
    public List<TenantDto> findAllTenants() {
        return userRepository.findByRole(Role.ROLE_TENANT)
                .stream()
                .map(this::mapToTenantDto)
                .collect(Collectors.toList());
    }

    private TenantDto mapToTenantDto(User user) {
        return new TenantDto(
            user.getId(),
            user.getBusinessName(),
            user.getBusinessDescription()
        );
    }
}