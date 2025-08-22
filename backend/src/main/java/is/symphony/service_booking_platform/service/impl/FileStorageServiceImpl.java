package is.symphony.service_booking_platform.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;

@Service
public class FileStorageServiceImpl { 

    private final Path root = Paths.get("uploads");

    @PostConstruct
    public void init() {
    try {
        if (!Files.exists(root)) {
            Files.createDirectories(root);
            System.out.println("Created upload directory: " + root.toAbsolutePath());
        }
    } catch (IOException e) {
        throw new RuntimeException("Could not initialize folder for upload!", e);
    }
    }

    public String save(MultipartFile file) {
    try {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file.");
        }
        String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        
        Path destinationFile = this.root.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), destinationFile);
        
        return uniqueFileName;
    } catch (Exception e) {
        throw new RuntimeException("Failed to store file. Error: " + e.getMessage(), e);
    }
    }
}