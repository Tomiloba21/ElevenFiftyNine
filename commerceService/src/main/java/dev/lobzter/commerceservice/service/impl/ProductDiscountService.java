package dev.lobzter.commerceservice.service.impl;


import dev.lobzter.commerceservice.model.Product;
import dev.lobzter.commerceservice.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;


@Service
@RequiredArgsConstructor
@Slf4j
public class ProductDiscountService {

    private final ProductRepository productRepository;

    @Value("${app.last-hour-deal.discount-percentage:20}")
    private BigDecimal discountPercentage;

    private static final int PAGE_SIZE = 100; // Process products in batches to avoid memory issues

    /**
     * Apply discount to all products based on percentage
     * @param discountPercentage percentage to discount (e.g., 20 for 20% off)
     */
    public void applyDiscountToAllProducts(int discountPercentage) {
        log.info("Applying {}% discount to all products", discountPercentage);

        // Factor to multiply the original price by (e.g., 0.8 for 20% off)
        BigDecimal discountFactor = BigDecimal.ONE.subtract(
                BigDecimal.valueOf(discountPercentage).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP)
        );

        // Process products in batches
        boolean hasMorePages = true;
        int pageNumber = 0;

        while (hasMorePages) {
            Pageable pageable = PageRequest.of(pageNumber, PAGE_SIZE);
            Page<Product> productPage = productRepository.findAll(pageable);

            if (productPage.hasContent()) {
                for (Product product : productPage.getContent()) {
                    // Calculate discounted price
                    BigDecimal originalPrice = product.getPrice();
                    BigDecimal discountedPrice = originalPrice.multiply(discountFactor).setScale(2, RoundingMode.HALF_UP);

                    // Update product
                    product.setPrice(discountedPrice);
                    product.setDiscountPrice(discountedPrice);
                    productRepository.save(product);

                    log.debug("Applied discount to product {}: original price = {}, discount price = {}",
                            product.getId(), originalPrice, discountedPrice);
                }

                // Check if there are more pages
                hasMorePages = pageNumber < productPage.getTotalPages() - 1;
                pageNumber++;
            } else {
                hasMorePages = false;
            }
        }

        log.info("Finished applying {}% discount to all products", discountPercentage);
    }

    /**
     * Reset discount prices for all products
     */
    public void resetAllProductDiscounts() {
        log.info("Resetting all product discounts");

        // Process products in batches
        boolean hasMorePages = true;
        int pageNumber = 0;

        while (hasMorePages) {
            Pageable pageable = PageRequest.of(pageNumber, PAGE_SIZE);
            Page<Product> productPage = productRepository.findAll(pageable);

            if (productPage.hasContent()) {
                for (Product product : productPage.getContent()) {
                    // Reset discount price

                    // Reset discount price
                    BigDecimal divisor = BigDecimal.ONE.subtract(
                            discountPercentage.divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP)
                    );
                    product.setPrice(product.getDiscountPrice().divide(divisor, 2, RoundingMode.HALF_UP));
                    product.setDiscountPrice(null);
                    productRepository.save(product);

                    log.debug("Reset discount for product {}", product.getId());
                }

                // Check if there are more pages
                hasMorePages = pageNumber < productPage.getTotalPages() - 1;
                pageNumber++;
            } else {
                hasMorePages = false;
            }
        }

        log.info("Finished resetting all product discounts");
    }
}