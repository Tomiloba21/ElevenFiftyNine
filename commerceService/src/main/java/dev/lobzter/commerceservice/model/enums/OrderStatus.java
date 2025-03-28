package dev.lobzter.commerceservice.model.enums;

public enum OrderStatus {
    PENDING,       // Initial order state
    PROCESSING,    // Order being prepared
    SHIPPED,       // Order has left the warehouse
    DELIVERED,     // Order received by customer
    CANCELLED,     // Order cancelled
    REFUNDED       // Order has been refunded
}