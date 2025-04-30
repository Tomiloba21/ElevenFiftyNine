package dev.lobzter.commerceservice.dto;


import dev.lobzter.commerceservice.model.Address;
import dev.lobzter.commerceservice.model.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class UserDto {
    private String id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private List<Address> addresses;
    private List<UserRole> roles;
    private boolean enabled;
    private int loyaltyPoints;
    private String membershipTier;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserRequest {
        @NotBlank(message = "Username is required")
        private String username;

        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        private String firstName;
        private String lastName;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserResponse {
        private String id;
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private List<Address> addresses;
        private List<UserRole> roles;
        private LocalDateTime createdAt;
        private LocalDateTime lastLogin;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserUpdateRequest {
        private String firstName;
        private String lastName;
        private String email;
    }
}