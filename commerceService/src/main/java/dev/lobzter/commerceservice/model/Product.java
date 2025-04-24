package dev.lobzter.commerceservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.util.HashSet;
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
    private String description;
    private BigDecimal price;
    private int stockQuantity;
    private Set<String> categories = new HashSet<>();
    private String imageUrl;
}

