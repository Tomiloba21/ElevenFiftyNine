package dev.lobzter.commerceservice.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ReviewDto {
    private String id;
    private String productId;
    private String userId;
    private String userName;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    private boolean verified;
    private List<String> images;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ReviewRequest {
        @NotNull(message = "Product ID is required")
        private String productId;

        @Min(value = 1, message = "Rating must be between 1 and 5")
        @Max(value = 5, message = "Rating must be between 1 and 5")
        private int rating;

        private String comment;
        private List<String> images;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ReviewResponse {
        private String id;
        private String productId;
        private String userName;
        private int rating;
        private String comment;
        private LocalDateTime createdAt;
        private boolean verified;
        private List<String> images;
    }
}