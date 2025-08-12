package is.symphony.service_booking_platform;

import is.symphony.service_booking_platform.model.TimeTemplate;
import is.symphony.service_booking_platform.repository.TimeTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalTime;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

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
    }
}