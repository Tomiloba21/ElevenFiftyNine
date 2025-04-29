package dev.lobzter.commerceservice.dto;

import dev.lobzter.commerceservice.model.enums.PaymentMethod;
import dev.lobzter.commerceservice.model.enums.PaymentStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class PaymentDto {
    private String id;
    private String orderId;
    private String userId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private String transactionId;
    private LocalDateTime paymentDate;
    private String billingAddressId;
    private String lastFourDigits;
    private String cardType;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PaymentRequest {
        @NotBlank(message = "Order ID is required")
        private String orderId;

        @NotNull(message = "Payment amount is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Payment amount must be greater than 0")
        private BigDecimal amount;

        @NotNull(message = "Payment method is required")
        private PaymentMethod paymentMethod;

        private String billingAddressId;
        private Map<String, String> paymentDetails;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PaymentResponse {
        private String id;
        private String orderId;
        private BigDecimal amount;
        private PaymentMethod paymentMethod;
        private PaymentStatus status;
        private String transactionId;
        private LocalDateTime paymentDate;
        private String lastFourDigits;
        private String cardType;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PaymentUpdateRequest {
        private PaymentStatus status;
        private String transactionId;
    }
}