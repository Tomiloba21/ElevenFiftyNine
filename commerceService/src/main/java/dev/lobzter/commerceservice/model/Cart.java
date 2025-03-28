package dev.lobzter.commerceservice.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.List;

@Document(value = "carts")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Cart {
    @Id
    private String id;

    private String userId;
    private List<CartItem> items;
    private BigDecimal totalPrice;

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    @Builder
    public static class CartItem {
        private String productId;
        private String productName;
        private int quantity;
        private BigDecimal price;
    }
}
