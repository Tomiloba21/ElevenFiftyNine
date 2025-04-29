package dev.lobzter.commerceservice.dto;

import dev.lobzter.commerceservice.model.enums.DiscountType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PromotionDto {
    private String id;
    private String code;
    private String description;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal minimumOrderAmount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private boolean isActive;
    private int usageLimit;
    private int usageCount;
    private List<String> applicableProductIds;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PromotionRequest {
        @NotBlank(message = "Promotion code is required")
        private String code;

        @NotBlank(message = "Description is required")
        private String description;

        @NotNull(message = "Discount type is required")
        private DiscountType discountType;

        @NotNull(message = "Discount value is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Discount value must be greater than 0")
        private BigDecimal discountValue;

        private BigDecimal minimumOrderAmount;

        @NotNull(message = "Start date is required")
        private LocalDateTime startDate;

        @NotNull(message = "End date is required")
        private LocalDateTime endDate;

        private boolean isActive;
        private int usageLimit;
        private List<String> applicableProductIds;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PromotionResponse {
        private String id;
        private String code;
        private String description;
        private DiscountType discountType;
        private BigDecimal discountValue;
        private BigDecimal minimumOrderAmount;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private boolean isActive;
        private int usageLimit;
        private int usageCount;
        private List<String> applicableProductIds;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PromotionUpdateRequest {
        private String description;
        private BigDecimal discountValue;
        private BigDecimal minimumOrderAmount;
        private LocalDateTime endDate;
        private Boolean isActive;
        private Integer usageLimit;
        private List<String> applicableProductIds;
    }
}