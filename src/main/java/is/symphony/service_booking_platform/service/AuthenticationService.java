package is.symphony.service_booking_platform.service;

import is.symphony.service_booking_platform.dto.LoginResponseDto;
import is.symphony.service_booking_platform.dto.auth.AuthenticationResponse;
import is.symphony.service_booking_platform.model.User;
import is.symphony.service_booking_platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(User request) {
        request.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(request);
        String jwtToken = jwtService.generateToken(request);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public LoginResponseDto authenticate(String email, String password) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(email, password)
    );
    User user = userRepository.findByEmail(email).orElseThrow();
    String jwtToken = jwtService.generateToken(user);
    
    user.setPassword(null);
    return LoginResponseDto.builder().token(jwtToken).user(user).build();
}
}