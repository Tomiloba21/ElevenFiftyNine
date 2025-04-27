package dev.lobzter.commerceservice.dto;

import dev.lobzter.commerceservice.model.enums.TransactionStatus;
import dev.lobzter.commerceservice.model.enums.TransactionType;
import jakarta.validation.constraints.DecimalMin;
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
public class TransactionDto {
    private String id;
    private String orderId;
    private String userId;
    private BigDecimal amount;
    private TransactionType type;
    private TransactionStatus status;
    private String paymentMethod;
    private String transactionReference;
    private LocalDateTime transactionDate;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TransactionRequest {
        @NotBlank(message = "Order ID is required")
        private String orderId;

        @NotNull(message = "Transaction amount is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Transaction amount must be greater than 0")
        private BigDecimal amount;

        @NotNull(message = "Transaction type is required")
        private TransactionType type;

        @NotNull(message = "Payment method is required")
        private String paymentMethod;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TransactionResponse {
        private String id;
        private String orderId;
        private BigDecimal amount;
        private TransactionType type;
        private TransactionStatus status;
        private String paymentMethod;
        private String transactionReference;
        private LocalDateTime transactionDate;
    }
}
