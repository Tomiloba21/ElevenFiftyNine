package dev.lobzter.commerceservice.controller;


import dev.lobzter.commerceservice.dto.UserDto;
import dev.lobzter.commerceservice.model.User;
import dev.lobzter.commerceservice.service.impl.UserService;
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
public class UserController {

    private final UserService userService;

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

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/{userId}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable String userId,
            @RequestBody UpdateUserStatusRequest request) {

        userService.updateUserStatus(userId, request.isEnabled());
        return ResponseEntity.ok(new ApiResponse(true, "User status updated successfully"));
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UpdateUserStatusRequest {
        private boolean enabled;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ApiResponse {
        private Boolean success;
        private String message;
    }
}