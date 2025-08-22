package is.symphony.service_booking_platform.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;
        private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable())

                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/uploads/**").permitAll() 
                                                .requestMatchers("/api/auth/**", "/oauth2/**").permitAll()
                                                .requestMatchers(HttpMethod.GET,
                                                                "/api/services",
                                                                "/api/services/*",
                                                                "/api/users/tenants",
                                                                "/api/availabilities/service/**")
                                                .permitAll()

                                                .requestMatchers(HttpMethod.GET, "/api/users/tenants").authenticated()
                                                .requestMatchers(HttpMethod.GET, "/api/services/tenant/**")
                                                .authenticated()
                                                .requestMatchers(HttpMethod.GET, "/api/availabilities/service/**")
                                                .authenticated()
                                                .requestMatchers(HttpMethod.GET, "/api/bookings/{id}/details")
                                                .authenticated()

                                                .requestMatchers(HttpMethod.POST, "/api/services").hasRole("TENANT")
                                                .requestMatchers(HttpMethod.GET, "/api/services/my-services")
                                                .hasRole("TENANT")
                                                .requestMatchers(HttpMethod.PATCH, "/api/availabilities/{id}/toggle")
                                                .hasRole("TENANT")
                                                .requestMatchers(HttpMethod.DELETE, "/api/bookings/tenant/**")
                                                .hasRole("TENANT")
                                                .requestMatchers(HttpMethod.PUT, "/api/services/*").hasRole("TENANT")
                                                .requestMatchers(HttpMethod.DELETE, "/api/services/*").hasRole("TENANT")

                                                .requestMatchers(HttpMethod.POST, "/api/bookings").hasRole("USER")
                                                .requestMatchers(HttpMethod.GET, "/api/bookings/my-bookings")
                                                .hasRole("USER")
                                                .requestMatchers(HttpMethod.DELETE, "/api/bookings/*").hasRole("USER")

                                                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                                .oauth2Login(oauth2 -> {
                                        oauth2.successHandler(oAuth2LoginSuccessHandler);
                                });
                return http.build();
        }

        @Bean
        CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(List.of("http://localhost:5173"));
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "x-auth-token"));
                configuration.setExposedHeaders(List.of("x-auth-token"));
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}