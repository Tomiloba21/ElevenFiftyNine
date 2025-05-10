package dev.lobzter.commerceservice.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.time.LocalDateTime;
public class ProductDto {

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductRequest {
        private String name;
        private String brand;
        private String description;
        private BigDecimal price;
        private int stockQuantity;
        private Set<String> colors;
        private List<String> sizes;
        private boolean featured;
        private String category;
        private List<String> tags;
        private ObjectId imageUrl;  // Using ObjectId type for consistency
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductResponse {
        private String id;
        private String name;
        private String brand;
        private String description;
        private BigDecimal price;
        private BigDecimal discountPrice;
        private int stockQuantity;
        private Set<String> colors;
        private List<String> sizes;
        private String category;
        private List<String> tags;
        private String imageUrl;  // Using ObjectId type for consistency
        private boolean featured;
        private int reviewCount;
        private double averageRating;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}