package dev.lobzter.commerceservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.math.BigDecimal;
import java.util.Set;

public class ProductDto {

    @Id
    private ObjectId id;
    private String name;
    private String description;
    private BigDecimal price;
    private int stockQuantity;
    private Set<String> categories;
    private String imageUrl;


    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductRequest {
        private String name;
        private String description;
        private BigDecimal price;
        private int stockQuantity;
        private Set<String> categories;
        private String imageUrl;
    }


    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductResponse {
        private ObjectId id;
        private String name;
        private String description;
        private BigDecimal price;
        private int stockQuantity;
        private Set<String> categories;
    }
}
