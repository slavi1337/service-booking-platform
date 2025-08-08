package is.symphony.service_booking_platform.controller;

import is.symphony.service_booking_platform.dto.auth.AuthenticationResponse;
import is.symphony.service_booking_platform.model.User;
import is.symphony.service_booking_platform.service.AuthenticationService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody User user) {
        return ResponseEntity.ok(authService.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.authenticate(request.getEmail(), request.getPassword()));
    }
    
    @Data
    static class LoginRequest {
        private String email;
        private String password;
    }
}