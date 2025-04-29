package dev.lobzter.commerceservice.model;

import dev.lobzter.commerceservice.model.enums.PaymentMethod;
import dev.lobzter.commerceservice.model.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "payments")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Payment {
    @Id
    private String id;
    private String orderId;
    private String userId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private String transactionId; // External payment gateway reference
    private LocalDateTime paymentDate;
    private Map<String, String> paymentDetails; // Store method-specific details
    private String billingAddressId;
    private String lastFourDigits; // For card payments
    private String cardType; // VISA, MASTERCARD, etc.
    private LocalDateTime expiryDate; // For tracking saved payment methods
}

