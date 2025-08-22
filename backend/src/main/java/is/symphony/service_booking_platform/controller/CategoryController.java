package is.symphony.service_booking_platform.controller;

import is.symphony.service_booking_platform.dto.ServiceCardDto;
import is.symphony.service_booking_platform.model.Category;
import is.symphony.service_booking_platform.service.interfaces.ICategoryService;
import is.symphony.service_booking_platform.service.interfaces.IServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final ICategoryService categoryService;
    private final IServiceService serviceService;

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category newCategory = categoryService.createCategory(category);
        return new ResponseEntity<>(newCategory, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.findAll();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{categoryName}/services")
    public ResponseEntity<List<ServiceCardDto>> getServicesByCategory(@PathVariable String categoryName) {
        List<ServiceCardDto> services = serviceService.findServicesByCategory(categoryName);
        return ResponseEntity.ok(services);
    }
}