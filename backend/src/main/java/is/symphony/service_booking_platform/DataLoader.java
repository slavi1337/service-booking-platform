package is.symphony.service_booking_platform;

import is.symphony.service_booking_platform.model.Availability;
import is.symphony.service_booking_platform.model.Service;
import is.symphony.service_booking_platform.repository.AvailabilityRepository;
import is.symphony.service_booking_platform.repository.ServiceRepository;
import is.symphony.service_booking_platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import is.symphony.service_booking_platform.model.User;
import is.symphony.service_booking_platform.model.Role;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ServiceRepository serviceRepository;
    private final AvailabilityRepository availabilityRepository;

    @Override
    public void run(String... args) throws Exception {

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

        populateMissingAvailabilities();
    }

    private void populateMissingAvailabilities() {
        System.out.println("Checking and populating future availabilities...");

        List<Service> allServices = serviceRepository.findAll();
        LocalDate today = LocalDate.now();

        final LocalTime OPENING_TIME = LocalTime.of(8, 0);
        final LocalTime CLOSING_TIME = LocalTime.of(16, 0);

        for (Service service : allServices) {
            final int duration = service.getDurationInMinutes();
            if (duration <= 0)
                continue;

            for (int i = 0; i < 7; i++) {
                LocalDate currentDate = today.plusDays(i);
                boolean availabilitiesExist = availabilityRepository.existsByServiceIdAndDate(service.getId(),
                        currentDate);

                if (!availabilitiesExist) {
                    System.out.println(
                            "Creating availabilities for service '" + service.getName() + "' on " + currentDate);
                    LocalTime currentTime = OPENING_TIME;

                    while (currentTime.plusMinutes(duration).isBefore(CLOSING_TIME)
                            || currentTime.plusMinutes(duration).equals(CLOSING_TIME)) {
                        Availability availability = new Availability();
                        availability.setService(service);
                        availability.setStartTime(currentTime);
                        availability.setDate(currentDate);
                        availabilityRepository.save(availability);

                        currentTime = currentTime.plusMinutes(duration);
                    }
                }
            }
        }
        System.out.println("Finished checking availabilities.");
    }
}