package is.symphony.service_booking_platform.dto;

import is.symphony.service_booking_platform.model.User;

public record LoginResponseDto(String token, User user) {}