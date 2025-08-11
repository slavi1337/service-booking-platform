package is.symphony.service_booking_platform.dto;

public record ServiceDto(
    Long id,
    String name,
    String category,
    String description,
    Double price,
    Integer durationInMinutes,
    String tenantName
) {}