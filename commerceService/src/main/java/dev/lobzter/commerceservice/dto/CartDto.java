package dev.lobzter.commerceservice.dto;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CartDto {
    private String id;
    private String userId;
    private List<CartItemDto> items;
    private BigDecimal totalPrice;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CartRequest {
        @NotNull(message = "Product ID is required")
        private String productId;

        @Min(value = 1, message = "Quantity must be at least 1")
        private int quantity;


    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CartResponse {
        private String id;
        private String userId;
        private List<CartItemDto> items;
        private BigDecimal subtotal;
        private int itemCount;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CartUpdateRequest {
        @NotNull(message = "Cart item ID is required")
        private String itemId;

        @Min(value = 1, message = "Quantity must be at least 1")
        private int quantity;
    }
}
