package dev.lobzter.commerceservice.service;

import dev.lobzter.commerceservice.dto.ProductDto;

public interface ProductService {


    ProductDto.ProductResponse createProduct(ProductDto.ProductRequest productRequest);
}
