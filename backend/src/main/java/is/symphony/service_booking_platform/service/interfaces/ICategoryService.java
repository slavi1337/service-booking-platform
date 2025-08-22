package is.symphony.service_booking_platform.service.interfaces;

import is.symphony.service_booking_platform.model.Category;
import java.util.List;

public interface ICategoryService {
    List<Category> findAll();

    Category createCategory(Category category);
}