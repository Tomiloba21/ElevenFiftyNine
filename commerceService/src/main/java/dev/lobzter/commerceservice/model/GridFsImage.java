package dev.lobzter.commerceservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "images")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GridFsImage {
    @Id
    private String id;
    private String filename;
    private String contentType;
    private Long size;
    private String productId;
    private LocalDateTime uploadDate;
}
