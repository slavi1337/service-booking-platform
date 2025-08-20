package is.symphony.service_booking_platform.config;

import is.symphony.service_booking_platform.model.Role;
import is.symphony.service_booking_platform.model.User;
import is.symphony.service_booking_platform.repository.UserRepository;
import is.symphony.service_booking_platform.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String firstName = oauthUser.getAttribute("given_name");
        String lastName = oauthUser.getAttribute("family_name");

        Optional<User> userOptional = userRepository.findByEmail(email);

        User user;
        if (userOptional.isEmpty()) {
            user = new User();
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setRole(Role.ROLE_USER);
            user.setEnabled(true);
            user.setAccountLocked(false);
            user.setPassword("");
            userRepository.save(user);
        } else {
            user = userOptional.get();
        }

        String jwtToken = jwtService.generateToken(user);
        String redirectUrl = "http://localhost:5173/oauth2/redirect?token=" + jwtToken;

        response.sendRedirect(redirectUrl);
    }
}