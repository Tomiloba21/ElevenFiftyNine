package dev.lobzter.commerceservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
public class AuthDto {

    // Request/Response classes
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LoginRequest {
        private String usernameOrEmail;
        private String password;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class JwtAuthResponse {
        private String accessToken;
        private String refreshToken;
        private String username;
        private List<String> roles;
        private String tokenType = "Bearer";
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TokenRefreshRequest {
        private String refreshToken;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TokenRefreshResponse {
        private String accessToken;
        private String refreshToken;
        private String tokenType = "Bearer";
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ForgotPasswordRequest {
        private String email;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ResetPasswordRequest {
        private String token;
        private String newPassword;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ApiResponse {
        private Boolean success;
        private String message;
    }
}
