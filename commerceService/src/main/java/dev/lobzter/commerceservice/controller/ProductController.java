package dev.lobzter.commerceservice.controller;


import dev.lobzter.commerceservice.dto.ProductDto;
import dev.lobzter.commerceservice.service.impl.GridFsImageService;
import dev.lobzter.commerceservice.service.impl.ProductServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@CrossOrigin("*")
@RestController
@RequestMapping("api/v1/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductServiceImpl productService;
    private final GridFsImageService imageService;

    @Tag(name = "Product")
    @Operation(summary = "Create Product")
    @PostMapping(value = "/")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ProductDto.ProductResponse> addProduct(
            @RequestPart("product") ProductDto.ProductRequest productRequest,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        log.info("called , {} {}", productRequest, image);

        // First create product without image
        ProductDto.ProductResponse createdProduct = productService.createProduct(productRequest);

        // Then handle image if provided
        if (image != null && !image.isEmpty()) {
            try {
                ObjectId imageId = imageService.storeFile(image, createdProduct.getId());
                productRequest.setImageUrl(imageId);
                createdProduct = productService.updateProduct(createdProduct.getId(), productRequest);
            } catch (IOException e) {
                log.error("Error storing image: ", e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        log.info("Product created successfully: {}", createdProduct);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    @Tag(name = "Product")
    @Operation(summary = "Get ProductBy Id")
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<ProductDto.ProductResponse> getProductById(@PathVariable String id) {
        ProductDto.ProductResponse product = productService.getProduct(id);
        return ResponseEntity.status(HttpStatus.OK).body(product);
    }

    @Tag(name = "Product")
    @Operation(summary = "Get All Product")
    @GetMapping("/")
    @ResponseStatus(HttpStatus.OK)
    public Page<ProductDto.ProductResponse> getAllProducts(
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return productService.getAllProducts(pageable);
    }

    @Tag(name = "Product")
    @Operation(summary = "Update Product")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<ProductDto.ProductResponse> updateProducts(
            @PathVariable String id,
            @RequestPart("product") ProductDto.ProductRequest updateRequest,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        // Get current product
        ProductDto.ProductResponse currentProduct = productService.getProduct(id);

        // If an image was uploaded, handle it
        if (image != null && !image.isEmpty()) {
            try {
                // Delete the old image if it exists
                if (currentProduct.getImageUrl() != null) {
                    try {
                        imageService.deleteFile(currentProduct.getImageUrl().toString());
                    } catch (Exception e) {
                        log.error("Failed to delete old image: ", e);
                    }
                }

                // Store the new image
                ObjectId imageId = imageService.storeFile(image, id);
                updateRequest.setImageUrl(imageId);
            } catch (IOException e) {
                log.error("Failed to store image: ", e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        // Update the product
        ProductDto.ProductResponse updatedProduct = productService.updateProduct(id, updateRequest);
        return ResponseEntity.ok(updatedProduct);
    }

    @Tag(name = "Product")
    @Operation(summary = "Partially Update A Product")
    @PatchMapping("/{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<ProductDto.ProductResponse> patchProducts(
            @PathVariable String id,
            @RequestBody ProductDto.ProductRequest patchRequest) {
        ProductDto.ProductResponse productResponse = productService.patchProduct(id, patchRequest);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(productResponse);
    }

    @Tag(name = "Product")
    @Operation(summary = "Delete ProductBy Id")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable String id) {
        try {
            ProductDto.ProductResponse product = productService.getProduct(id);

            // Delete the associated image if it exists
            if (product.getImageUrl() != null) {
                try {
                    imageService.deleteFile(product.getImageUrl().toString());
                } catch (Exception e) {
                    log.error("Failed to delete image: ", e);
                }
            }

            productService.deleteProduct(id);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Product Deleted");
        } catch (Exception e) {
            log.error("Error deleting product: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting product: " + e.getMessage());
        }
    }
}