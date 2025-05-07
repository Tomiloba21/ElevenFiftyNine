package dev.lobzter.commerceservice;
import com.fasterxml.jackson.databind.ObjectMapper;

import dev.lobzter.commerceservice.dto.AuthDto;
import dev.lobzter.commerceservice.dto.ProductDto;
import dev.lobzter.commerceservice.model.Product;
import dev.lobzter.commerceservice.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.containers.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashSet;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
public class ProductIntegrationTest {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:4.0.10");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;


    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry dynamicPropertyRegistry) {
        dynamicPropertyRegistry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
    }

    @BeforeEach
    void setup() {
        // Ensure we start with a clean database for each test
        productRepository.deleteAll();
    }

    @AfterEach
    void cleanup() {
        // Clean up after tests
        productRepository.deleteAll();
    }

    // Fix 1: Add this JWT helper method for authentication
    private String getJwtToken() throws Exception {
        // Create a login request or use a pre-generated token
        // This is a placeholder - you'll need to adjust based on your actual auth implementation
        AuthDto.LoginRequest loginRequest = new AuthDto.LoginRequest(adminUsername, adminPassword);
        String loginJson = objectMapper.writeValueAsString(loginRequest);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andReturn();

        // Extract token from response
        String response = result.getResponse().getContentAsString();

        AuthDto.JwtAuthResponse jwtResponse = objectMapper.readValue(response, AuthDto.JwtAuthResponse.class);

        return jwtResponse.getAccessToken();
    }

    @Test
    void shouldCreateProduct() throws Exception {
        // Given
        ProductDto.ProductRequest productRequest = getProductRequest();
        String productRequestString = objectMapper.writeValueAsString(productRequest);

        // When & Then
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/product/")
                        .header("Authorization", "Bearer " + getJwtToken()) // Add JWT token
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productRequestString))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is(productRequest.getName())))
                .andExpect(jsonPath("$.description", is(productRequest.getDescription())))
                .andExpect(jsonPath("$.price", is(productRequest.getPrice())))
                .andExpect(jsonPath("$.id", notNullValue()));

        assertEquals(1, productRepository.findAll().size());
    }

    @Test
    void shouldCreateProductWithMultipartData() throws Exception {
        // Given
        ProductDto.ProductRequest productRequest = getProductRequest();
        String productRequestJson = objectMapper.writeValueAsString(productRequest);

        MockMultipartFile productPart = new MockMultipartFile(
                "product",
                "",
                "application/json",
                productRequestJson.getBytes());

        MockMultipartFile imagePart = new MockMultipartFile(
                "image",
                "test-image.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test image content".getBytes());

        // When & Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/product/")
                        .file(productPart)
                        .file(imagePart)
                        .header("Authorization", "Bearer " + getJwtToken())) // Add JWT token
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is(productRequest.getName())))
                .andExpect(jsonPath("$.imageUrl", notNullValue()));

        assertEquals(1, productRepository.findAll().size());
    }

    @Test
    void shouldGetAllProducts() throws Exception {
        // Given
        createSampleProducts(3);

        // When & Then
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/product/")
                        .param("size", "10")
                        .param("sort", "name,asc")
                        .header("Authorization", "Bearer " + getJwtToken())) // Add JWT token
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(3)))
                .andExpect(jsonPath("$.totalElements", is(3)));
    }

    @Test
    void shouldGetProductById() throws Exception {
        // Given
        String productId = createSampleProduct();

        // When & Then
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/product/{id}", productId)
                        .header("Authorization", "Bearer " + getJwtToken())) // Add JWT token
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(productId)))
                .andExpect(jsonPath("$.name", is("Test Product")));
    }

    @Test
    void shouldReturn404ForNonExistentProduct() throws Exception {
        // When & Then
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/product/{id}", "12345432")
                        .header("Authorization", "Bearer " + getJwtToken())) // Add JWT token
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldUpdateProduct() throws Exception {
        // Given
        String productId = createSampleProduct();

        ProductDto.ProductRequest updateRequest = ProductDto.ProductRequest.builder()
                .name("Updated Product")
                .description("Updated Description")
                .price(BigDecimal.valueOf(149.99))
                .stockQuantity(20)
                .colors(new HashSet<>(Arrays.asList("Yellow", "Red"))) // Fix 2: Correct Set creation
                .build();

        String updateRequestJson = objectMapper.writeValueAsString(updateRequest);

        MockMultipartFile productPart = new MockMultipartFile(
                "product",
                "",
                "application/json",
                updateRequestJson.getBytes());

        // When & Then
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/v1/product/{id}", productId)
                        .file(productPart)
                        .header("Authorization", "Bearer " + getJwtToken()) // Add JWT token
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        }))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Product")))
                .andExpect(jsonPath("$.description", is("Updated Description")))
                .andExpect(jsonPath("$.price", is(149.99)));
    }

    @Test
    void shouldPartiallyUpdateProduct() throws Exception {
        // Given
        String productId = createSampleProduct();

        ProductDto.ProductRequest patchRequest = ProductDto.ProductRequest.builder()
                .name("Patched Name")
                .build();

        String patchRequestJson = objectMapper.writeValueAsString(patchRequest);

        // When & Then
        mockMvc.perform(MockMvcRequestBuilders.patch("/api/v1/product/{id}", productId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(patchRequestJson)
                        .header("Authorization", "Bearer " + getJwtToken())) // Add JWT token
                .andDo(print())
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.name", is("Patched Name")))
                .andExpect(jsonPath("$.description", is("Test Description"))); // Original value preserved
    }

    @Test
    void shouldDeleteProduct() throws Exception {
        // Given
        String productId = createSampleProduct();
        assertEquals(1, productRepository.findAll().size());

        // When & Then
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/v1/product/{id}", productId)
                        .header("Authorization", "Bearer " + getJwtToken())) // Add JWT token
                .andDo(print())
                .andExpect(status().isAccepted())
                .andExpect(content().string("Product Deleted"));

        assertEquals(0, productRepository.findAll().size());
    }

    // Helper methods

    private String createSampleProduct() {
        Product product = Product.builder()
                .name("Test Product")
                .brand("Test Brand")
                .description("Test Description")
                .price(BigDecimal.valueOf(99.99))
                .stockQuantity(10)
                .colors(new HashSet<>(Arrays.asList("Red", "Blue"))) // Fix 3: Correct Set creation
                .sizes(Arrays.asList("S", "M", "L"))
                .tags(Arrays.asList("new", "featured"))
                .category("Electronics")
                .featured(true)
                .reviewCount(5)
                .averageRating(4.5)
                .build();

        Product savedProduct = productRepository.save(product);
        return savedProduct.getId();
    }

    private void createSampleProducts(int count) {
        for (int i = 0; i < count; i++) {
            Product product = Product.builder()
                    .name("Test Product " + i)
                    .brand("Test Brand")
                    .description("Test Description " + i)
                    .price(BigDecimal.valueOf(99.99 + i))
                    .stockQuantity(10 + i)
                    .colors(new HashSet<>(Arrays.asList("Red", "Blue"))) // Fix 4: Correct Set creation
                    .category("Electronics")
                    .build();

            productRepository.save(product);
        }
    }

    private ProductDto.ProductRequest getProductRequest() {
        return ProductDto.ProductRequest.builder()
                .name("Test Product")
                .brand("Test Brand")
                .description("Test Description")
                .price(BigDecimal.valueOf(99.99))
                .stockQuantity(10)
                .colors(new HashSet<>(Arrays.asList("Red", "Blue"))) // Fix 5: Correct Set creation
                .sizes(Arrays.asList("S", "M", "L"))
                .tags(Arrays.asList("new", "featured"))
                .category("Electronics")
                .build();
    }
}