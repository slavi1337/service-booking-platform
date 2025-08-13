package is.symphony.service_booking_platform.controller;

import is.symphony.service_booking_platform.dto.LoginResponseDto;
import is.symphony.service_booking_platform.dto.auth.AuthenticationResponse;
import is.symphony.service_booking_platform.dto.request.LoginRequest;
import is.symphony.service_booking_platform.model.User;
import is.symphony.service_booking_platform.service.interfaces.IAuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final IAuthenticationService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody User user) {
        return ResponseEntity.ok(authService.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.authenticate(request.email(), request.password()));
    }
}