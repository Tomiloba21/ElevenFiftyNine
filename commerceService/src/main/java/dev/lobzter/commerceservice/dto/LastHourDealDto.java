package dev.lobzter.commerceservice.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class LastHourDealDto {
    private String id;
    private String productId;
    private String dealTitle;
    private String description;
    private BigDecimal originalPrice;
    private BigDecimal dealPrice;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int stockLimit;
    private int soldCount;
    private boolean isActive;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LastHourDealRequest {
        @NotBlank(message = "Product ID is required")
        private String productId;

        @NotBlank(message = "Deal title is required")
        private String dealTitle;

        private String description;

        @NotNull(message = "Original price is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Original price must be greater than 0")
        private BigDecimal originalPrice;

        @NotNull(message = "Deal price is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Deal price must be greater than 0")
        private BigDecimal dealPrice;

        @NotNull(message = "Start time is required")
        private LocalDateTime startTime;

        @NotNull(message = "End time is required")
        private LocalDateTime endTime;

        @Min(value = 1, message = "Stock limit must be at least 1")
        private int stockLimit;

        private boolean isActive;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LastHourDealResponse {
        private String id;
        private String productId;
        private String productName;
        private String productImageUrl;
        private String dealTitle;
        private String description;
        private BigDecimal originalPrice;
        private BigDecimal dealPrice;
        private double discountPercentage;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private int stockLimit;
        private int soldCount;
        private int remainingStock;
        private boolean isActive;
        private long timeRemaining; // in seconds
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LastHourDealUpdateRequest {
        private String dealTitle;
        private String description;
        private BigDecimal dealPrice;
        private LocalDateTime endTime;
        private Boolean isActive;
    }
}