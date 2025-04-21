package dev.lobzter.commerceservice.service.impl;

import dev.lobzter.commerceservice.dto.ProductDto;
import dev.lobzter.commerceservice.model.Product;
import dev.lobzter.commerceservice.repository.ProductRepository;
import dev.lobzter.commerceservice.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ProductServiceImpl implements ProductService {


    private final ProductRepository productRepository;


    @Override
    public ProductDto.ProductResponse createProduct(ProductDto.ProductRequest productRequest) {
        return  null;
    }

    @Override
    public List<ProductDto.ProductResponse> getAllProducts() {
        return List.of();
    }

    @Override
    public ProductDto.ProductResponse getProduct(ObjectId id) {
        return null;
    }

    @Override
    public ProductDto.ProductResponse updateProduct(ObjectId id, ProductDto.ProductRequest newProductRequest) {
        return null;
    }

    @Override
    public void deleteProduct(ObjectId id) {

    }


    private ProductDto.ProductResponse mapToDto(Product product){
        return ProductDto.ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .categories(product.getCategories())
                .build();

    }

}
