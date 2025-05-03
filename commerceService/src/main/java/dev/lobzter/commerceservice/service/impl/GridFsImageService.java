package dev.lobzter.commerceservice.service.impl;

import com.mongodb.client.gridfs.model.GridFSFile;
import lombok.RequiredArgsConstructor;

import org.apache.commons.io.IOUtils;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class GridFsImageService {

    private final GridFsTemplate gridFsTemplate;
    private final GridFsOperations gridFsOperations;

    /**
     * Store a file in GridFS
     * @param file The file to store
     * @param productId The ID of the product this image belongs to
     * @return The ID of the stored file
     * @throws IOException If there's an error reading the file
     */

    public ObjectId storeFile(MultipartFile file, String productId) throws IOException {

        Map<String, String> metadata = Map.of(
                "productId", productId,
                "uploadDate", LocalDateTime.now().toString(),
                "originalFilename", file.getOriginalFilename()
        );

        // Store file in GridFS with metadata
        ObjectId fileId = gridFsTemplate.store(
                file.getInputStream(),
                generateFilename(file.getOriginalFilename(), productId),
                file.getContentType(),
                metadata
        );

        return fileId;
    }
    /**
     * Generate a unique filename for GridFS storage
     */
    private String generateFilename(String originalFilename, String productId) {
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        return "product_" + productId + "_" + System.currentTimeMillis() + extension;
    }


    /**
     * Get file by ID
     * @param id The ID of the file to retrieve
     * @return The GridFSFile object
     */
    public GridFSFile getFile(String id) {
        return gridFsTemplate.findOne(new Query(Criteria.where("_id").is(new ObjectId(id))));
    }

    /**
     * Get file as resource by ID
     * @param id The ID of the file to retrieve
     * @return The GridFsResource object
     */
    public GridFsResource getResource(String id) {
        GridFSFile file = getFile(id);
        if (file == null) {
            return null;
        }
        return gridFsOperations.getResource(file);
    }

    /**
     * Get file content as byte array
     * @param id The ID of the file to retrieve
     * @return The file content as byte array
     * @throws IOException If there's an error reading the file
     */
    public byte[] getFileContent(String id) throws IOException {
        GridFsResource resource = getResource(id);
        if (resource == null) {
            return null;
        }
        return IOUtils.toByteArray(resource.getInputStream());
    }

    /**
     * Delete file by ID
     * @param id The ID of the file to delete
     */
    public void deleteFile(String id) {
        gridFsTemplate.delete(new Query(Criteria.where("_id").is(new ObjectId(id))));

    }

    /**
     * Delete all files associated with a product
     * @param productId The ID of the product
     */
    public void deleteFilesByProductId(String productId) {
        gridFsTemplate.delete(new Query(Criteria.where("metadata.productId").is(productId)));
    }

    /**
     * Get content type of a file
     * @param id The ID of the file
     * @return The content type
     */
    public String getContentType(String id) {
        GridFSFile file = getFile(id);
        if (file == null || file.getMetadata() == null) {
            return "application/octet-stream";
        }
        return file.getMetadata().getString("_contentType");
    }
}
