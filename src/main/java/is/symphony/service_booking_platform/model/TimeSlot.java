package is.symphony.service_booking_platform.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "time_slots")
@NoArgsConstructor 
public class TimeSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private LocalDateTime slotTime;

    @Column(nullable = false)
    private boolean isBooked = false;

    public TimeSlot(LocalDateTime slotTime) {
        this.slotTime = slotTime;
    }
}