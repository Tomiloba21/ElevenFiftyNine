package dev.lobzter.commerceservice.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
@Data
@Builder
public class ProductDto {
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private int stockQuantity;
    private Set<String> categories;
    private String imageUrl;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductRequest {
        @NotBlank(message = "Product name is required")
        private String name;

        private String description;
        private String brand;

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
        private BigDecimal price;

        @Min(value = 0, message = "Stock quantity cannot be negative")
        private int stockQuantity;

        private Set<String> colors;
        private List<String> sizes;
        private List<String> tags;
        private String imageUrl;
        private String category;
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
        private String imageUrl;
        private boolean featured;
        private int reviewCount;
        private double averageRating;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductUpdateRequest {
        private String name;
        private String description;
        private String brand;
        private BigDecimal price;
        private BigDecimal discountPrice;
        private Integer stockQuantity;
        private Set<String> colors;
        private List<String> sizes;
        private String category;
        private List<String> tags;
        private String imageUrl;
        private Boolean featured;
    }
}