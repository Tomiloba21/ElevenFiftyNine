package dev.lobzter.commerceservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
public class CategoryDto {
    private String id;
    private String name;
    private String description;
    private String imageUrl;
    private String parentCategoryId;
    private int displayOrder;
    private boolean isActive;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CategoryRequest {
        @NotBlank(message = "Category name is required")
        private String name;

        private String description;
        private String imageUrl;
        private String parentCategoryId;
        private Integer displayOrder;
        private Boolean isActive;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CategoryResponse {
        private String id;
        private String name;
        private String description;
        private String imageUrl;
        private String parentCategoryId;
        private String parentCategoryName;
        private int displayOrder;
        private boolean isActive;
        private List<CategoryDto> subcategories;
    }
}