package dev.lobzter.commerceservice.dto;

import dev.lobzter.commerceservice.model.Address;
import dev.lobzter.commerceservice.model.enums.OrderStatus;
import dev.lobzter.commerceservice.model.enums.PaymentMethod;
import jakarta.validation.constraints.NotEmpty;
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
public class OrderDto {
    private String id;
    private String orderNumber;
    private String customerId;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private LocalDateTime orderDate;
    private List<OrderItemDto> orderItems;
    private Address shippingAddress;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderRequest {
        @NotEmpty(message = "Order must contain at least one item")
        private List<OrderItemDto> orderItems;

        @NotNull(message = "Shipping address is required")
        private Address shippingAddress;

        private String paymentMethod;
        private String couponCode;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderResponse {
        private String id;
        private String orderNumber;
        private OrderStatus status;
        private BigDecimal subtotal;
        private BigDecimal shippingCost;
        private BigDecimal taxAmount;
        private BigDecimal discountAmount;
        private BigDecimal totalAmount;
        private LocalDateTime orderDate;
        private List<OrderItemDto> orderItems;
        private Address shippingAddress;
        private String paymentId;
        private PaymentMethod paymentMethod;
        private String trackingNumber;
        private LocalDateTime shippedDate;
        private LocalDateTime deliveredDate;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderStatusUpdateRequest {
        @NotNull(message = "Order status is required")
        private OrderStatus status;
        private String trackingNumber;
        private String notes;
    }
}

