package is.symphony.service_booking_platform.repository;

import is.symphony.service_booking_platform.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}