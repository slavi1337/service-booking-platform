package is.symphony.service_booking_platform.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "availabilities")
public class Availability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private TimeTemplate template;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private boolean isAvailable = true;

    @Column(nullable = false)
    private boolean isBooked = false;
}