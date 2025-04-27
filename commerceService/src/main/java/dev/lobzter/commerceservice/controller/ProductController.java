package dev.lobzter.commerceservice.controller;


import dev.lobzter.commerceservice.dto.ProductDto;
import dev.lobzter.commerceservice.service.impl.ProductServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
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


    @Tag(name = "Product")
    @Operation(summary = "Create Product")
    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ProductDto.ProductResponse> addProduct(@RequestBody ProductDto.ProductRequest productRequest){
        ProductDto.ProductResponse product = productService.createProduct(productRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @Tag(name = "Product")
    @Operation(summary = "Get ProductBy Id")
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<ProductDto.ProductResponse> getProductById(@PathVariable String id){
        ProductDto.ProductResponse product = productService.getProduct(id);
        return ResponseEntity.status(HttpStatus.OK).body(product);
    }

    @Tag(name = "Product")
    @Operation(summary = "Get All Product")
    @GetMapping("/")
    @ResponseStatus(HttpStatus.OK)
    public Page<ProductDto.ProductResponse> getAllProducts(
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC
            ) Pageable pageable){
        return productService.getAllProducts(pageable);
    }


    @Tag(name = "Product")
    @Operation(summary = "Update all Product ---Not completed Yet")
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<ProductDto.ProductResponse> updateProducts(@PathVariable String id, ProductDto.ProductRequest updatedRequest){

        ProductDto.ProductResponse productResponse = productService.updateProduct(id, updatedRequest);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(productResponse);
    }

    @Tag(name = "Product")
    @Operation(summary = "Update A Product--Patch--not completed")
    @PatchMapping("/{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<ProductDto.ProductResponse> PatchProducts(@PathVariable String id, ProductDto.ProductRequest updatedRequest){

        ProductDto.ProductResponse productResponse = productService.patchProduct(id, updatedRequest);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(productResponse);
    }


    @Tag(name = "Product")
    @Operation(summary = "Delete ProductBy Id")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable String id){
        productService.deleteProduct(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Product Deleted");
    }



}
