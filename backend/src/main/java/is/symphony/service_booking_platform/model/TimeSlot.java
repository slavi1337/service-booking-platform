package is.symphony.service_booking_platform.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Entity
@Table(
    name = "time_slots",
    uniqueConstraints = @UniqueConstraint(columnNames = {"slot_time", "service_id"})
)
@NoArgsConstructor
public class TimeSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime slotTime;

    @Column(nullable = false)
    private boolean isBooked = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    public TimeSlot(LocalDateTime slotTime, Service service) {
        this.slotTime = slotTime;
        this.service = service;
    }
}