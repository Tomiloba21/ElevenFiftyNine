package dev.lobzter.commerceservice.service;

import dev.lobzter.commerceservice.dto.ProductDto;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {


    ProductDto.ProductResponse createProduct(ProductDto.ProductRequest productRequest);
    Page<ProductDto.ProductResponse> getAllProducts(Pageable pageable);

    ProductDto.ProductResponse getProduct(ObjectId id);

    ProductDto.ProductResponse updateProduct(ObjectId id, ProductDto.ProductRequest newProductRequest);

    void deleteProduct(ObjectId id);
}
