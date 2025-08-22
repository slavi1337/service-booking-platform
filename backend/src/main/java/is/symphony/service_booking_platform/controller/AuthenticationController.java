package is.symphony.service_booking_platform.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import is.symphony.service_booking_platform.dto.LoginResponseDto;
import is.symphony.service_booking_platform.dto.auth.AuthenticationResponse;
import is.symphony.service_booking_platform.dto.request.LoginRequest;
import is.symphony.service_booking_platform.exception.BookingException;
import is.symphony.service_booking_platform.exception.ResourceNotFoundException;
import is.symphony.service_booking_platform.model.User;
import is.symphony.service_booking_platform.service.interfaces.IAuthenticationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final IAuthenticationService authService;

    @PostMapping(value = "/register", consumes = {"multipart/form-data"})
    public ResponseEntity<AuthenticationResponse> register(
        @RequestPart("user") User user, 
        @RequestPart(value = "imageFile", required = false) MultipartFile imageFile 
    ) {
    return ResponseEntity.ok(authService.register(user, imageFile));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.authenticate(request.email(), request.password()));
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyUser(@RequestParam("token") String token) {
        try {
            String message = authService.verifyUser(token);
            return ResponseEntity.ok(message);
        } catch (ResourceNotFoundException | BookingException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}