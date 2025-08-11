package is.symphony.service_booking_platform.controller;

import is.symphony.service_booking_platform.dto.TenantDto;
import is.symphony.service_booking_platform.service.interfaces.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    @GetMapping("/tenants")
    public ResponseEntity<List<TenantDto>> getAllTenants() {
        return ResponseEntity.ok(userService.findAllTenants());
    }
}