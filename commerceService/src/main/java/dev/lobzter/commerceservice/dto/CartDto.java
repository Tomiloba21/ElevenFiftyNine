package dev.lobzter.commerceservice.dto;


import dev.lobzter.commerceservice.model.Cart;
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

    @Id
    private String id;

    private String userId;
    private List<CartDto.CartItemDto> items;
    private BigDecimal totalPrice;

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    @Builder
    public static class CartItemDto {
        private String productId;
        private String productName;
        private int quantity;
        private BigDecimal price;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CartRequest{

        private String userId;
        private List<CartDto.CartItemDto> items;
        private BigDecimal totalPrice;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CartResponse{

        private String userId;
        private List<CartDto.CartItemDto> items;
        private BigDecimal totalPrice;
    }


}
