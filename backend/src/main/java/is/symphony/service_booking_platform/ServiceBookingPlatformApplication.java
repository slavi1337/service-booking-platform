package is.symphony.service_booking_platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class ServiceBookingPlatformApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServiceBookingPlatformApplication.class, args);
	}
}
