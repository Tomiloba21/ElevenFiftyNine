package dev.lobzter.commerceservice.dto;


import dev.lobzter.commerceservice.model.Address;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserDto {

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

}
