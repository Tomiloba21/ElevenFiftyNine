package dev.lobzter.commerceservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "inventory")
@Data
public class Inventory {
    @Id
    private String id;
    private String productId;
    private String color;
    private String size;
    private int quantity;
    private String locationCode; // Warehouse location
    private LocalDateTime lastUpdated;
}