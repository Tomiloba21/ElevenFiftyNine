package dev.lobzter.commerceservice.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(value = "password_reset_tokens")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PasswordResetToken {

    @Id
    private String id;

    private String token;

    private String userId;

    private LocalDateTime expiryDate;

    private boolean used;

    public boolean isExpired() {
        return expiryDate.isBefore(LocalDateTime.now());
    }
}
