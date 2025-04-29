package dev.lobzter.commerceservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "categories")
@Data
public class Category {
    @Id
    private String id;
    private String name;
    private String description;
    private String imageUrl;
    private String parentCategoryId; // For hierarchical categories
    private int displayOrder; // For controlling display sequence
    private boolean isActive;
}