package is.symphony.service_booking_platform.service.interfaces;

import org.springframework.web.multipart.MultipartFile;

import is.symphony.service_booking_platform.dto.LoginResponseDto;
import is.symphony.service_booking_platform.dto.auth.AuthenticationResponse;
import is.symphony.service_booking_platform.model.User;

public interface IAuthenticationService {
    AuthenticationResponse register(User user,MultipartFile imageFile);

    LoginResponseDto authenticate(String email, String password);

    String verifyUser(String token);
}