package dev.lobzter.commerceservice.model;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

import java.util.List;

@Document(value = "users")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true)
    private String email;

    private String password; // Store hashed password
    private String firstName;
    private String lastName;

    private List<Address> addresses;

    private List<String> roles;



    // Add loyalty program fields
    private int loyaltyPoints;
    private String membershipTier; // Regular, Silver, Gold, etc.

    // Add notification preferences
    private boolean emailNotificationsEnabled;
    private boolean smsNotificationsEnabled;

    // Add wishlist
    private List<String> wishlist; // Product IDs

    private boolean enabled;
    private boolean accountNonExpired;
    private boolean credentialsNonExpired;
    private boolean accountNonLocked;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;

}
