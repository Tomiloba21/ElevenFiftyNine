package dev.lobzter.commerceservice.model;

import dev.lobzter.commerceservice.model.enums.DiscountType;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "promotions")
@Data
public class Promotion {
    @Id
    private String id;
    private String code;
    private String description;
    private DiscountType discountType; // PERCENTAGE, FIXED_AMOUNT
    private BigDecimal discountValue;
    private BigDecimal minimumOrderAmount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private boolean isActive;
    private int usageLimit; // How many times can be used
    private int usageCount; // How many times has been used
    private List<String> applicableProductIds; // Empty means all products
}

