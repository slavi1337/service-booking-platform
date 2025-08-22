package is.symphony.service_booking_platform.service.impl;

import org.springframework.stereotype.Service;
import is.symphony.service_booking_platform.model.Category;
import is.symphony.service_booking_platform.repository.CategoryRepository;
import is.symphony.service_booking_platform.service.interfaces.ICategoryService;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements ICategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }
}
