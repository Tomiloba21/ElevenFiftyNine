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

import java.util.List;
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {


    private final ProductRepository productRepository;


    @Override
    public ProductDto.ProductResponse createProduct(ProductDto.ProductRequest productRequest) {
        Product product = Product.builder()
                .name(productRequest.getName())
                .description(productRequest.getDescription())
                .price(productRequest.getPrice())
                .stockQuantity(productRequest.getStockQuantity())
                .categories(productRequest.getCategories())
                .build();

        productRepository.save(product);

        return  mapToDto(product);
    }

    @Override
    public Page<ProductDto.ProductResponse> getAllProducts(Pageable pageable) {
        return  productRepository.findAll(pageable)
                .map(this::mapToDto);

    }

    @Override
    public ProductDto.ProductResponse getProduct(ObjectId id) {
        return productRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(()-> new ProductExceptions("Product Not Found"));
    }

    @Override
    public ProductDto.ProductResponse updateProduct(ObjectId id, ProductDto.ProductRequest newProductRequest) {
        Product updatedProduct = productRepository.findById(id)
                .map(existingProduct ->{
                    existingProduct.setName(newProductRequest.getName());
                    existingProduct.setDescription(newProductRequest.getDescription());
                    existingProduct.setPrice(newProductRequest.getPrice());
                    existingProduct.setStockQuantity(newProductRequest.getStockQuantity());
                    existingProduct.setCategories(newProductRequest.getCategories());
                    return productRepository.save(existingProduct);
                })

                .orElseThrow(()-> new  ProductExceptions("Product not found with the id " + id));
        return mapToDto(updatedProduct);
    }

    @Override
    public void deleteProduct(ObjectId id) {

        //TODO -> destructive add checker first in next version
        productRepository.deleteById(id);

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
