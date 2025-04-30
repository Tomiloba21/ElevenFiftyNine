package dev.lobzter.commerceservice.config;

import dev.lobzter.commerceservice.model.User;
import dev.lobzter.commerceservice.model.enums.UserRole;
import dev.lobzter.commerceservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AdminUserInitializer implements CommandLineRunner {

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.firstName:Admin}")
    private String adminFirstName;

    @Value("${app.admin.lastName:User}")
    private String adminLastName;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public void run(String... args) {
        // Check if admin user already exists
        if (!userRepository.existsByUsername(adminUsername)) {
            User adminUser = User.builder()
                    .username(adminUsername)
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .firstName(adminFirstName)
                    .lastName(adminLastName)
                    .roles(List.of(UserRole.ROLE_ADMIN))
                    .enabled(true)
                    .accountNonExpired(true)
                    .credentialsNonExpired(true)
                    .accountNonLocked(true)
                    .loyaltyPoints(0)
                    .membershipTier("Regular")
                    .emailNotificationsEnabled(true)
                    .smsNotificationsEnabled(false)
                    .wishlist(Collections.emptyList())
                    .addresses(Collections.emptyList())
                    .createdAt(LocalDateTime.now())
                    .build();

            userRepository.save(adminUser);
            System.out.println("Admin user created successfully: " + adminUsername);
        } else {
            System.out.println("Admin user already exists: " + adminUsername);
        }
    }
}
