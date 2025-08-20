package is.symphony.service_booking_platform;

import is.symphony.service_booking_platform.model.Availability;
import is.symphony.service_booking_platform.model.Service;
import is.symphony.service_booking_platform.model.TimeTemplate;
import is.symphony.service_booking_platform.repository.AvailabilityRepository;
import is.symphony.service_booking_platform.repository.ServiceRepository;
import is.symphony.service_booking_platform.repository.TimeTemplateRepository;
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
    private final TimeTemplateRepository timeTemplateRepository;
    private final ServiceRepository serviceRepository;
    private final AvailabilityRepository availabilityRepository;

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

        populateMissingAvailabilities();
    }

    private void populateMissingAvailabilities() {
        System.out.println("Checking and populating future availabilities for existing services...");

        List<Service> allServices = serviceRepository.findAll();
        List<TimeTemplate> allTemplates = timeTemplateRepository.findAll();
        LocalDate today = LocalDate.now();

        if (allServices.isEmpty()) {
            System.out.println("No existing services found. Skipping availability population.");
            return;
        }

        for (Service service : allServices) {
            for (int i = 0; i < 7; i++) {
                LocalDate currentDate = today.plusDays(i);

                boolean availabilitiesExist = availabilityRepository.existsByServiceIdAndDate(service.getId(),
                        currentDate);

                if (!availabilitiesExist) {
                    System.out.println(
                            "Creating availabilities for service '" + service.getName() + "' on " + currentDate);
                    for (TimeTemplate template : allTemplates) {
                        Availability availability = new Availability();
                        availability.setService(service);
                        availability.setTemplate(template);
                        availability.setDate(currentDate);
                        availabilityRepository.save(availability);
                    }
                }
            }
        }
        System.out.println("Finished checking and populating availabilities.");
    }
}