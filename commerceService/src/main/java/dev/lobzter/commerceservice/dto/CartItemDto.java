package dev.lobzter.commerceservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public class CartItemDto {
        private String id;
        private String productId;
        private int quantity;
        private BigDecimal price;


        public BigDecimal getSubtotal() {
            return price.multiply(BigDecimal.valueOf(quantity));
        }
    }