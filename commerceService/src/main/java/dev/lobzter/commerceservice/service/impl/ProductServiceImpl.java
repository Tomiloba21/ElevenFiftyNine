package dev.lobzter.commerceservice.service.impl;

import dev.lobzter.commerceservice.dto.ProductDto;
import dev.lobzter.commerceservice.repository.ProductRepository;
import dev.lobzter.commerceservice.service.ProductService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {


    private final ProductRepository productRepository;

    @Override
    public ProductDto.ProductResponse createProduct(ProductDto.ProductRequest productRequest) {
        return null;
    }

//    public Product createProduct(Product product) {
//        return productRepository.save(product);
//    }
//
//    public Optional<Product> getProductById(String id) {
//        return productRepository.findById(id);
//    }
//
//    public List<Product> getAllProducts() {
//        return productRepository.findAll();
//    }
//
//    public List<Product> getProductsByCategory(String category) {
//        return productRepository.findByCategoriesContaining(category);
//    }
//
//    public Product updateProduct(Product product) {
//        return productRepository.save(product);
//    }
//
//    public void deleteProduct(String id) {
//        productRepository.deleteById(id);
//    }

}
