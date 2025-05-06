package dev.lobzter.commerceservice.controller;


import dev.lobzter.commerceservice.dto.UserDto;
import dev.lobzter.commerceservice.model.User;
import dev.lobzter.commerceservice.service.impl.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "APIs for user profile management and admin operations")
public class UserController {

    private final UserService userService;

    @Operation(
            summary = "Get current user profile",
            description = "Retrieves the profile information of the currently authenticated user"
    )
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .addresses(user.getAddresses())
                .roles(user.getRoles())
                .enabled(user.isEnabled())
                .loyaltyPoints(user.getLoyaltyPoints())
                .membershipTier(user.getMembershipTier())
                .build();

        return ResponseEntity.ok(userDto);
    }

    @Operation(
            summary = "Update current user profile",
            description = "Updates the profile information of the currently authenticated user",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "User profile data to update",
                    required = true,
                    content = @Content(schema = @Schema(implementation = UserDto.UserUpdateRequest.class))
            ))
    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@RequestBody UserDto.UserUpdateRequest updateRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User updatedUser = userService.updateUser(username, updateRequest);

        UserDto userDto = UserDto.builder()
                .id(updatedUser.getId())
                .username(updatedUser.getUsername())
                .email(updatedUser.getEmail())
                .firstName(updatedUser.getFirstName())
                .lastName(updatedUser.getLastName())
                .addresses(updatedUser.getAddresses())
                .roles(updatedUser.getRoles())
                .enabled(updatedUser.isEnabled())
                .loyaltyPoints(updatedUser.getLoyaltyPoints())
                .membershipTier(updatedUser.getMembershipTier())
                .build();

        return ResponseEntity.ok(userDto);
    }

    @Operation(
            summary = "Change user password",
            description = "Changes the password of the currently authenticated user",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Current and new password data",
                    required = true,
                    content = @Content(schema = @Schema(implementation = ChangePasswordRequest.class))
            ))
    @PostMapping("/me/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        boolean result = userService.changePassword(username, request.getCurrentPassword(), request.getNewPassword());

        if (result) {
            return ResponseEntity.ok(new ApiResponse(true, "Password changed successfully"));
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Current password is incorrect"));
        }
    }

    @Tag(name = "Admin Operations")
    @Operation(
            summary = "Get all users (Admin only)",
            description = "Retrieves information of all users in the system. Requires admin role.",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    @Tag(name = "Admin Operations")
    @Operation(
            summary = "Update user status (Admin only)",
            description = "Enables or disables a specific user. Requires admin role.",
            parameters = {
                    @Parameter(name = "userId", description = "ID of the user to update", required = true)
            },
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "User enabled status data",
                    required = true,
                    content = @Content(schema = @Schema(implementation = UpdateUserStatusRequest.class))
            ),
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/{userId}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable String userId,
            @RequestBody UpdateUserStatusRequest request) {

        userService.updateUserStatus(userId, request.isEnabled());
        return ResponseEntity.ok(new ApiResponse(true, "User status updated successfully"));
    }

    @Schema(description = "Request model for changing user password")
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChangePasswordRequest {
        @Schema(description = "User's current password")
        private String currentPassword;

        @Schema(description = "User's new password")
        private String newPassword;
    }

    @Schema(description = "Request model for updating user status")
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UpdateUserStatusRequest {
        @Schema(description = "Whether the user account should be enabled or disabled")
        private boolean enabled;
    }

    @Schema(description = "Generic API response")
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ApiResponse {
        @Schema(description = "Indicates if the operation was successful")
        private Boolean success;

        @Schema(description = "Response message")
        private String message;
    }
}