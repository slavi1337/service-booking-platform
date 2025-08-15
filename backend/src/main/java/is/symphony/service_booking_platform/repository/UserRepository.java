package is.symphony.service_booking_platform.repository;

import is.symphony.service_booking_platform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import is.symphony.service_booking_platform.model.Role;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    List<User> findByRole(Role role);

    Optional<User> findByVerificationToken(String token);
}