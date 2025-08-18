package is.symphony.service_booking_platform.dto;

public record UserDto(
        Long id,
        String firstName,
        String lastName,
        String businessName,
        String email,
        String role,
        boolean isVerified,
        boolean isActive) {
}