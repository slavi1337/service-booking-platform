package is.symphony.service_booking_platform.service;

import is.symphony.service_booking_platform.model.Role;
import is.symphony.service_booking_platform.model.Service;
import is.symphony.service_booking_platform.model.User;
import is.symphony.service_booking_platform.repository.ServiceRepository;
import is.symphony.service_booking_platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    public Service createService(Service service, Long tenantId) {
        User tenant = userRepository.findById(tenantId)
                .orElseThrow(() -> new IllegalStateException("Tenant sa ID-jem " + tenantId + " ne postoji."));
        
        if (tenant.getRole() != Role.ROLE_TENANT) {
            throw new IllegalStateException("Korisnik mora imati rolu TENANT da bi kreirao uslugu.");
        }
        
        service.setProviderTenant(tenant);
        return serviceRepository.save(service);
    }
}