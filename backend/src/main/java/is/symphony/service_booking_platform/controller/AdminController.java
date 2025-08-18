package is.symphony.service_booking_platform.controller;

import is.symphony.service_booking_platform.dto.UserDto;
import is.symphony.service_booking_platform.service.interfaces.IAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final IAdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.findAllUsers());
    }

    @PatchMapping("/users/{id}/lock")
    public ResponseEntity<Void> lockUser(@PathVariable Long id) {
        adminService.toggleUserLock(id, true);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/users/{id}/unlock")
    public ResponseEntity<Void> unlockUser(@PathVariable Long id) {
        adminService.toggleUserLock(id, false);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}