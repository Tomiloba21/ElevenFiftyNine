package dev.lobzter.commerceservice.service;

import dev.lobzter.commerceservice.dto.ProductDto;
import org.bson.types.ObjectId;

import java.util.List;

public interface ProductService {


    ProductDto.ProductResponse createProduct(ProductDto.ProductRequest productRequest);
    List<ProductDto.ProductResponse> getAllProducts();

    ProductDto.ProductResponse getProduct(ObjectId id);

    ProductDto.ProductResponse updateProduct(ObjectId id, ProductDto.ProductRequest newProductRequest);

    void deleteProduct(ObjectId id);
}
