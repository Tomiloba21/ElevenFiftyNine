package dev.lobzter.commerceservice.model;

import dev.lobzter.commerceservice.model.enums.TransactionStatus;
import dev.lobzter.commerceservice.model.enums.TransactionType;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "transactions")
@Data
public class Transaction {
    @Id
    private String id;
    private String orderId;
    private String userId;
    private BigDecimal amount;
    private TransactionType type; // PAYMENT, REFUND
    private TransactionStatus status;
    private String paymentMethod; // CREDIT_CARD, PAYPAL, etc.
    private String transactionReference; // External payment gateway reference
    private LocalDateTime transactionDate;
}