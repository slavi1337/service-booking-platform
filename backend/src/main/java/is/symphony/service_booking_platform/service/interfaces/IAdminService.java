package is.symphony.service_booking_platform.service.interfaces;

import is.symphony.service_booking_platform.dto.UserDto; // Kreiraćemo ovaj DTO
import java.util.List;

public interface IAdminService {
    List<UserDto> findAllUsers();

    void toggleUserLock(Long userId, boolean isLocked);

    void deleteUser(Long userId);
}