package dev.lobzter.commerceservice.service.impl;



import dev.lobzter.commerceservice.dto.UserDto;
import dev.lobzter.commerceservice.model.PasswordResetToken;
import dev.lobzter.commerceservice.model.User;
import dev.lobzter.commerceservice.model.enums.UserRole;
import dev.lobzter.commerceservice.repository.PasswordResetTokenRepository;
import dev.lobzter.commerceservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final CustomUserDetailsService userDetailsService;

    @Value("${app.password-reset.expiration-minutes}")
    private int passwordResetExpirationMinutes;

    public UserDetails loadUserByUsername(String usernameOrEmail) {
        return userDetailsService.loadUserByUsername(usernameOrEmail);
    }

    public User createUser(UserDto.UserRequest userRequest) {
        User user = User.builder()
                .username(userRequest.getUsername())
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .firstName(userRequest.getFirstName())
                .lastName(userRequest.getLastName())
                .roles(Collections.singletonList(UserRole.valueOf(UserRole.ROLE_CUSTOMER.name())))
                .enabled(true)
                .accountNonExpired(true)
                .credentialsNonExpired(true)
                .accountNonLocked(true)
                .createdAt(LocalDateTime.now())
                .addresses(new ArrayList<>())
                .loyaltyPoints(0)
                .membershipTier("Regular")
                .emailNotificationsEnabled(true)
                .smsNotificationsEnabled(false)
                .wishlist(new ArrayList<>())
                .build();

        return userRepository.save(user);
    }

    public Boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public Boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean processForgotPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmailAndEnabledTrue(email);

        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();
        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUserId(user.getId());
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(passwordResetExpirationMinutes));
        resetToken.setUsed(false);

        passwordResetTokenRepository.save(resetToken);

        // Send email with reset link
        String resetLink = "https://your-frontend-app.com/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);

        return true;
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByTokenAndUsedFalse(token);

        if (tokenOpt.isEmpty() || tokenOpt.get().getExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }

        PasswordResetToken resetToken = tokenOpt.get();
        Optional<User> userOpt = userRepository.findById(resetToken.getUserId());

        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        return true;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User updateUser(String username, UserDto.UserUpdateRequest updateRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        if (updateRequest.getFirstName() != null) {
            user.setFirstName(updateRequest.getFirstName());
        }

        if (updateRequest.getLastName() != null) {
            user.setLastName(updateRequest.getLastName());
        }

        if (updateRequest.getEmail() != null && !updateRequest.getEmail().equals(user.getEmail())) {
            // Check if email is already in use by another user
            if (userRepository.existsByEmail(updateRequest.getEmail())) {
                throw new IllegalArgumentException("Email is already in use");
            }
            user.setEmail(updateRequest.getEmail());
        }

        return userRepository.save(user);
    }

    public boolean changePassword(String username, String currentPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return false;
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return true;
    }

    public List<UserDto> findAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> UserDto.builder()
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
                        .build())
                .collect(Collectors.toList());
    }

    public void updateUserStatus(String userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(enabled);
        userRepository.save(user);
    }
}