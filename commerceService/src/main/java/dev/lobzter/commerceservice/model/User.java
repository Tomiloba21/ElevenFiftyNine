package dev.lobzter.commerceservice.model;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(value = "user")
@Getter
@Setter
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

    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;

    private boolean enabled;
    private boolean accountNonExpired;
    private boolean credentialsNonExpired;
    private boolean accountNonLocked;

    public User() {
        this.addresses = new ArrayList<>();
        this.roles = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.enabled = true;
        this.accountNonExpired = true;
        this.credentialsNonExpired = true;
        this.accountNonLocked = true;
    }

    public User(String username, String email, String password,
                String firstName, String lastName) {
        this();
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }



}
