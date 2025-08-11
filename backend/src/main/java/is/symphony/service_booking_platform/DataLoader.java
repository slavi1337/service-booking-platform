package is.symphony.service_booking_platform;

import is.symphony.service_booking_platform.model.TimeSlot;
import is.symphony.service_booking_platform.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final TimeSlotRepository timeSlotRepository;
    private static final int DAYS_TO_GENERATE = 7;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Filling up time slots...");
        //populateMissingTimeSlots();
    }

    private void populateMissingTimeSlots() {
        LocalDate today = LocalDate.now();
        int slotsCreated = 0;

        for (int i = 0; i < DAYS_TO_GENERATE; i++) {
            LocalDate currentDay = today.plusDays(i);
            for (int hour = 8; hour <= 15; hour++) {
                LocalDateTime slotTime = currentDay.atTime(hour, 0);
                
                /*if (!timeSlotRepository.existsBySlotTime(slotTime)) {
                    TimeSlot newSlot = new TimeSlot(slotTime);
                    timeSlotRepository.save(newSlot);
                    slotsCreated++;
                }*/
            }
        }
        
        if (slotsCreated > 0) {
            System.out.println("Successfully created " + slotsCreated + " new available time slots.");
        } else {
            System.out.println("No need to create new time slots.");
        }
    }
}