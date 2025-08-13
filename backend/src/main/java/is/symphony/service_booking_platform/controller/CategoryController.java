package is.symphony.service_booking_platform.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import is.symphony.service_booking_platform.dto.CategoryDto;
import is.symphony.service_booking_platform.dto.ServiceCardDto;
import is.symphony.service_booking_platform.service.interfaces.IServiceService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final IServiceService serviceService;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        return ResponseEntity.ok(serviceService.findAllDistinctCategories());
    }

    @GetMapping("/{categoryName}/services")
    public ResponseEntity<List<ServiceCardDto>> getServicesByCategory(@PathVariable String categoryName) {
        return ResponseEntity.ok(serviceService.findServicesByCategory(categoryName));
    }
}