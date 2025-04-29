package dev.lobzter.commerceservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "reviews")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Review {
    @Id
    private String id;
    private String productId;
    private String userId;
    private String userName; // Display name
    private int rating; // 1-5
    private String comment;
    private LocalDateTime createdAt;
    private boolean verified; // Was this a verified purchase
    private List<String> images; // Customer images
}
