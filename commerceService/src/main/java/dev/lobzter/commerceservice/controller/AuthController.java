package dev.lobzter.commerceservice.controller;



import dev.lobzter.commerceservice.config.JwtTokenProvider;
import dev.lobzter.commerceservice.dto.AuthDto;
import dev.lobzter.commerceservice.dto.UserDto;
import dev.lobzter.commerceservice.model.User;
import dev.lobzter.commerceservice.service.impl.UserService;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthDto.LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String jwt = tokenProvider.generateToken(userDetails);
        String refreshToken = tokenProvider.generateRefreshToken(userDetails);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new AuthDto.JwtAuthResponse(
                jwt,
                refreshToken,
                userDetails.getUsername(),
                roles,
                "Bearer"
        ));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody AuthDto.TokenRefreshRequest request) {
        try {
            String username = tokenProvider.extractUsername(request.getRefreshToken());
            UserDetails userDetails = userService.loadUserByUsername(username);

            if (tokenProvider.validateToken(request.getRefreshToken(), userDetails)) {
                String newAccessToken = tokenProvider.generateToken(userDetails);

                return ResponseEntity.ok(new AuthDto.TokenRefreshResponse(
                        newAccessToken,
                        request.getRefreshToken(),
                        "Bearer"
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthDto.ApiResponse(false, "Invalid refresh token"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthDto.ApiResponse(false, "Error processing refresh token"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserDto.UserRequest userRequest) {
        // Check if username is already taken
        if (userService.existsByUsername(userRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new AuthDto.ApiResponse(false, "Username is already taken!"));
        }

        // Check if email is already in use
        if (userService.existsByEmail(userRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new AuthDto.ApiResponse(false, "Email is already in use!"));
        }

        // Create new user account
        User user = userService.createUser(userRequest);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthDto.ApiResponse(true, "User registered successfully"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody AuthDto.ForgotPasswordRequest request) {
        boolean result = userService.processForgotPassword(request.getEmail());

        if (result) {
            return ResponseEntity.ok(new AuthDto.ApiResponse(true,
                    "Password reset instructions sent to your email"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthDto.ApiResponse(false, "Email not found or account is disabled"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody AuthDto.ResetPasswordRequest request) {
        boolean result = userService.resetPassword(request.getToken(), request.getNewPassword());

        if (result) {
            return ResponseEntity.ok(new AuthDto.ApiResponse(true, "Password has been reset successfully"));
        } else {
            return ResponseEntity.badRequest()
                    .body(new AuthDto.ApiResponse(false, "Invalid or expired token"));
        }
    }




}