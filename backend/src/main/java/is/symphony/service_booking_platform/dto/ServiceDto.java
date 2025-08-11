package is.symphony.service_booking_platform.dto;

import lombok.Data;

@Data
public class ServiceDto {
    private Long id;
    private String name;
    private String category;
    private String description;
    private Double price;
    private Integer durationInMinutes;
    private String tenantName;
}