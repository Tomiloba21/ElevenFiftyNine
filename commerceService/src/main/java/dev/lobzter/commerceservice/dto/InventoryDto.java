package dev.lobzter.commerceservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
public class InventoryDto {
    private String id;
    private String productId;
    private String color;
    private String size;
    private int quantity;
    private String locationCode;
    private LocalDateTime lastUpdated;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class InventoryRequest {
        @NotBlank(message = "Product ID is required")
        private String productId;

        @NotBlank(message = "Color is required")
        private String color;

        @NotBlank(message = "Size is required")
        private String size;

        @Min(value = 0, message = "Quantity cannot be negative")
        private int quantity;

        private String locationCode;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class InventoryResponse {
        private String id;
        private String productId;
        private String productName;
        private String color;
        private String size;
        private int quantity;
        private String locationCode;
        private LocalDateTime lastUpdated;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class InventoryUpdateRequest {
        @Min(value = 0, message = "Quantity cannot be negative")
        private Integer quantity;
        private String locationCode;
    }
}