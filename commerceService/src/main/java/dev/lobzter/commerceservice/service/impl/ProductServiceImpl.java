package dev.lobzter.commerceservice.service.impl;

import dev.lobzter.commerceservice.dto.ProductDto;
import dev.lobzter.commerceservice.exceptions.ProductExceptions;
import dev.lobzter.commerceservice.model.Product;
import dev.lobzter.commerceservice.repository.ProductRepository;
import dev.lobzter.commerceservice.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public ProductDto.ProductResponse createProduct(ProductDto.ProductRequest productRequest) {
        Product product = Product.builder()
                .name(productRequest.getName())
                .brand(productRequest.getBrand())
                .description(productRequest.getDescription())
                .price(productRequest.getPrice())
                .stockQuantity(productRequest.getStockQuantity())
                .featured(productRequest.isFeatured())
                .colors(productRequest.getColors())
                .sizes(productRequest.getSizes())
                .tags(productRequest.getTags())
                .imageUrl(productRequest.getImageUrl() != null ? productRequest.getImageUrl().toString() : null)
                .category(productRequest.getCategory())
                .build();

        productRepository.save(product);

        return mapToDto(product);
    }

    @Override
    public Page<ProductDto.ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(this::mapToDto);
    }

    @Override
    public ProductDto.ProductResponse getProduct(String id) {
        return productRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new ProductExceptions("Product Not Found"));
    }

    @Override
    public ProductDto.ProductResponse updateProduct(String id, ProductDto.ProductRequest newProductRequest) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ProductExceptions("Product not found with the id " + id));

        if (newProductRequest.getName() != null) {
            existingProduct.setName(newProductRequest.getName());
        }
        existingProduct.setFeatured(newProductRequest.isFeatured());

        if (newProductRequest.getDescription() != null) {
            existingProduct.setDescription(newProductRequest.getDescription());
        }
        if (newProductRequest.getPrice() != null) {
            existingProduct.setPrice(newProductRequest.getPrice());
        }
        if (newProductRequest.getStockQuantity() != 0) {
            existingProduct.setStockQuantity(newProductRequest.getStockQuantity());
        }
        if (newProductRequest.getColors() != null) {
            existingProduct.setColors(newProductRequest.getColors());
        }

        if (newProductRequest.getImageUrl() != null) {
            existingProduct.setImageUrl(newProductRequest.getImageUrl().toString());
        }

        Product updatedProduct = productRepository.save(existingProduct);

        return mapToDto(updatedProduct);
    }

    @Override
    public ProductDto.ProductResponse patchProduct(String id, ProductDto.ProductRequest patchRequest) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ProductExceptions("Product not found with the id " + id));

        // Only update fields that are provided
        if (patchRequest.getName() != null) {
            existingProduct.setName(patchRequest.getName());
        }
        if (patchRequest.getColors() != null) {
            existingProduct.setColors(patchRequest.getColors());  // Fixed: was setting name instead of colors
        }
        if (patchRequest.getPrice() != null) {
            existingProduct.setPrice(patchRequest.getPrice());
        }
        if (patchRequest.getDescription() != null) {
            existingProduct.setDescription(patchRequest.getDescription());
        }
        if (patchRequest.getStockQuantity() != 0) {  // Fixed: was checking colors but setting stockQuantity
            existingProduct.setStockQuantity(patchRequest.getStockQuantity());
        }
        if (patchRequest.getImageUrl() != null) {
            existingProduct.setImageUrl(patchRequest.getImageUrl().toString());
        }

        Product updatedProduct = productRepository.save(existingProduct);
        return mapToDto(updatedProduct);
    }

    @Override
    public void deleteProduct(String id) {
        //TODO -> destructive add checker first in next version
        productRepository.deleteById(id);
    }

    private ProductDto.ProductResponse mapToDto(Product product) {
        ProductDto.ProductResponse.ProductResponseBuilder builder = ProductDto.ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .brand(product.getBrand())
                .description(product.getDescription())
                .price(product.getPrice())
                .discountPrice(product.getDiscountPrice())
                .stockQuantity(product.getStockQuantity())
                .colors(product.getColors())
                .sizes(product.getSizes())
                .category(product.getCategory())
                .tags(product.getTags())
                .featured(product.isFeatured())
                .reviewCount(product.getReviewCount())
                .averageRating(product.getAverageRating());

        // Safely convert imageUrl String to ObjectId if it exists and is valid
        if (product.getImageUrl() != null && !product.getImageUrl().isEmpty()) {
            try {
                builder.imageUrl(product.getImageUrl());
            } catch (IllegalArgumentException e) {
                // Log the error but continue with the conversion
                System.err.println("Invalid ObjectId format: " + product.getImageUrl());
                // Either set to null or keep as is depending on your requirements
                builder.imageUrl(null);
            }
        }

        return builder.build();
    }
}
