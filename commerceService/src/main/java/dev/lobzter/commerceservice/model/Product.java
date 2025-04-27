package dev.lobzter.commerceservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Document(collection = "products")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Product {

    @Id
    private String id;

    private String name;
    private String brand;
    private String description;
    private BigDecimal price;
    private int stockQuantity;
    private Set<String> colors = new HashSet<>();
    private String imageUrl;
    private List<String> sizes; // S, M, L, XL, etc.
    private String category; // T-shirts, Hoodies, etc.
    private List<String> tags; // For filtering/searching
    private BigDecimal discountPrice; // For sales
    private boolean featured; // For homepage featuring
    private Map<String, Map<String, Integer>> inventory;
    private int reviewCount;
    private double averageRating;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}



