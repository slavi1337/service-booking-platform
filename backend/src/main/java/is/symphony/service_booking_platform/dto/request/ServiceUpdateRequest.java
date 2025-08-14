package is.symphony.service_booking_platform.dto.request;

public record ServiceUpdateRequest(
        String name,
        String category,
        String description,
        Double price,
        Integer durationInMinutes) {
}