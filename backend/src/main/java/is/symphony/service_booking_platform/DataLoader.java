package is.symphony.service_booking_platform;

import is.symphony.service_booking_platform.model.TimeTemplate;
import is.symphony.service_booking_platform.repository.TimeTemplateRepository;
import is.symphony.service_booking_platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalTime;
import is.symphony.service_booking_platform.model.User;
import is.symphony.service_booking_platform.model.Role;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TimeTemplateRepository timeTemplateRepository;

    @Override
    public void run(String... args) throws Exception {
        if (timeTemplateRepository.count() == 0) {
            System.out.println("Creating default time templates...");
            for (int hour = 8; hour <= 15; hour++) {
                TimeTemplate template = new TimeTemplate();
                template.setStartTime(LocalTime.of(hour, 0));
                timeTemplateRepository.save(template);
            }
        }

        if (userRepository.findByEmail("admin@admin.com").isEmpty()) {
            System.out.println("Creating default admin account...");

            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("admin");
            admin.setEmail("admin@admin.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ROLE_ADMIN);
            admin.setEnabled(true);

            userRepository.save(admin);
            System.out.println("Admin user created.");
        }
    }
}