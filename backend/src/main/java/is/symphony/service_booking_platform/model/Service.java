package is.symphony.service_booking_platform.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "services")
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = true)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer durationInMinutes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private User providerTenant;
}
