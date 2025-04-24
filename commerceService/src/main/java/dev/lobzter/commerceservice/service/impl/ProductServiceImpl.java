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
    public ProductDto.ProductResponse getProduct(String id) {
        return productRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(()-> new ProductExceptions("Product Not Found"));
    }

    @Override
    public ProductDto.ProductResponse updateProduct(String id, ProductDto.ProductRequest newProductRequest) {

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ProductExceptions("Product not found with the id " + id));


        if (newProductRequest.getName() != null) {
            existingProduct.setName(newProductRequest.getName());
        }
        if (newProductRequest.getDescription() != null) {
            existingProduct.setDescription(newProductRequest.getDescription());
        }
        if (newProductRequest.getPrice() != null) {
            existingProduct.setPrice(newProductRequest.getPrice());
        }
        if (newProductRequest.getStockQuantity() != 0) {
            existingProduct.setStockQuantity(newProductRequest.getStockQuantity());
        }
        if (newProductRequest.getCategories() != null) {
            existingProduct.setCategories(newProductRequest.getCategories());
        }

//        existingProduct.setName(newProductRequest.getName());
//        existingProduct.setDescription(newProductRequest.getDescription());
//        existingProduct.setPrice(newProductRequest.getPrice());
//        existingProduct.setStockQuantity(newProductRequest.getStockQuantity());
//        existingProduct.setCategories(newProductRequest.getCategories());

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
        if (patchRequest.getCategories() != null) {
            existingProduct.setName(patchRequest.getCategories().toString());
        }
        if (patchRequest.getPrice() != null){
            existingProduct.setPrice(patchRequest.getPrice());
        }
        if (patchRequest.getDescription() != null){
            existingProduct.setDescription(patchRequest.getDescription());
        }
        if (patchRequest.getCategories() != null){
            existingProduct.setStockQuantity(patchRequest.getStockQuantity());
        }
        // Apply other fields similarly

        Product updatedProduct = productRepository.save(existingProduct);
        return mapToDto(updatedProduct);
    }

    @Override
    public void deleteProduct(String id) {

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
