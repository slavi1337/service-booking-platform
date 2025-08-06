package is.symphony.service_booking_platform.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String serviceName;
    
    @Column(nullable = false)
    private String clientEmail;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "time_slot_id", referencedColumnName = "id")
    private TimeSlot timeSlot;
}