package dev.lobzter.commerceservice.model;


import dev.lobzter.commerceservice.model.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Document(value = "orders")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Order {

    @Id
    private String id;
    private String orderNumber;
    private String customerId;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private LocalDateTime orderDate;
    private List<OrderItem> orderItems;
    private Address shippingAddress;


    @Document(value = "orderItem")//remove
    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    @Builder
    public static class OrderItem {

        @Id
        private String productId;
        private String productName;
        private Integer quantity;
        private BigDecimal unitPrice;

        /**
         * Calculates subtotal for this order item
         *
         * @return BigDecimal representing the subtotal
         */
        public BigDecimal getSubTotal() {
            return unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
    }
}
