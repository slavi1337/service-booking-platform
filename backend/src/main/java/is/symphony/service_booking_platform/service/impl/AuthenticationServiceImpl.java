package is.symphony.service_booking_platform.service.impl;

import is.symphony.service_booking_platform.dto.LoginResponseDto;
import is.symphony.service_booking_platform.dto.auth.AuthenticationResponse;
import is.symphony.service_booking_platform.exception.BookingException;
import is.symphony.service_booking_platform.exception.ResourceNotFoundException;
import is.symphony.service_booking_platform.model.User;
import is.symphony.service_booking_platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import is.symphony.service_booking_platform.service.interfaces.IAuthenticationService;
import is.symphony.service_booking_platform.service.interfaces.IEmailService;

import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import is.symphony.service_booking_platform.service.JwtService;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements IAuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final IEmailService emailService;

    @Override
    public AuthenticationResponse register(User request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BookingException("Email address is already in use.");
        }

        request.setPassword(passwordEncoder.encode(request.getPassword()));

        String token = UUID.randomUUID().toString();
        request.setVerificationToken(token);
        request.setTokenExpiryDate(LocalDateTime.now().plusHours(24));
        request.setEnabled(false);

        User savedUser = userRepository.save(request);

        String recipientName = savedUser.getFirstName() != null ? savedUser.getFirstName()
                : savedUser.getBusinessName();
        emailService.sendVerificationEmail(savedUser.getEmail(), recipientName, token);

        return new AuthenticationResponse(null);
    }

    @Override
    @Transactional
    public String verifyUser(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid verification token."));

        if (user.getTokenExpiryDate().isBefore(LocalDateTime.now())) {
            return "Token has expired. Please request a new verification link.";
        }

        user.setEnabled(true);
        user.setVerificationToken(null);
        user.setTokenExpiryDate(null);
        userRepository.save(user);

        return "Email successfully verified! You can now log in.";
    }

    @Override
    public LoginResponseDto authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!user.isEnabled()) {
            throw new DisabledException("User account is not verified. Please check your email.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));

        String jwtToken = jwtService.generateToken(user);
        user.setPassword(null);
        return new LoginResponseDto(jwtToken, user);
    }
}