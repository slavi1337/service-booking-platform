package is.symphony.service_booking_platform.dto.request;

public record ServiceCreateRequest(
        String name,
        String description,
        Double price,
        Integer durationInMinutes,
        Long categoryId) {
}