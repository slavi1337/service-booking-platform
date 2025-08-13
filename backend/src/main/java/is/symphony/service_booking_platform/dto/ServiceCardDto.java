package is.symphony.service_booking_platform.dto;

public record  ServiceCardDto (
    Long serviceId,
    String serviceName,
    String tenantName,
    Double price,
    Integer durationInMinutes){
    
}
