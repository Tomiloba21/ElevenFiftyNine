package dev.lobzter.commerceservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "lastHourDeals")
@Data
public class LastHourDeal {
    @Id
    private String id;
    private String productId;
    private String dealTitle;
    private String description;
    private BigDecimal originalPrice;
    private BigDecimal dealPrice;
    private LocalDateTime startTime; // Should be 11:59 PM
    private LocalDateTime endTime; // Usually 24 hours later
    private int stockLimit; // Max units available at deal price
    private int soldCount; // How many sold so far
    private boolean isActive;
}