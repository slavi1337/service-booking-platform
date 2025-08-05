package is.symphony.service_booking_platform.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String serviceName;
    
    @Column(nullable = false)
    private String clientEmail;

    @Column(nullable = false, unique = true)
    private LocalDateTime bookingTime;
}