package dev.lobzter.commerceservice.controller;


import dev.lobzter.commerceservice.dto.ProductDto;
import dev.lobzter.commerceservice.service.impl.ProductServiceImpl;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;




@RestController
@RequestMapping("${spring.data.rest.base-path}/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductServiceImpl productService;


    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ProductDto.ProductResponse> addProduct(@RequestBody ProductDto.ProductRequest productRequest){
        ProductDto.ProductResponse product = productService.createProduct(productRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<ProductDto.ProductResponse> getProductById(@PathVariable ObjectId id){
        ProductDto.ProductResponse product = productService.getProduct(id);
        return ResponseEntity.status(HttpStatus.OK).body(product);
    }

    @GetMapping("/")
    @ResponseStatus(HttpStatus.OK)
    public Page<ProductDto.ProductResponse> getAllProducts(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC
            ) Pageable pageable){
        return productService.getAllProducts(pageable);
    }


    @PatchMapping("/{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<ProductDto.ProductResponse> updateProducts(@PathVariable ObjectId id, ProductDto.ProductRequest updatedRequest){

        ProductDto.ProductResponse productResponse = productService.updateProduct(id, updatedRequest);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(productResponse);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable ObjectId id){
        productService.deleteProduct(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Product Deleted");
    }



}
