package dev.lobzter.commerceservice.controller;


import dev.lobzter.commerceservice.service.impl.ProductDiscountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api/v1/admin/discounts")
@Tag(name = "AdminDiscount", description = "APIs for Manually seting the discount service")
@RequiredArgsConstructor
public class ProductDiscountController {

    private final ProductDiscountService productDiscountService;

    @Value("${app.last-hour-deal.discount-percentage:20}")
    private int defaultDiscountPercentage;

    @Tag(name = "AdminDiscount")
    @Operation(summary = "Manually Activate Last Hour Deals")
    @PostMapping("/activate")
    public ResponseEntity<String> activateLastHourDeals(
            @RequestParam(required = false) Integer discountPercentage) {

        int percentage = discountPercentage != null ? discountPercentage : defaultDiscountPercentage;

        log.info("Manual activation of last hour deals with {}% discount", percentage);
        productDiscountService.applyDiscountToAllProducts(percentage);

        return ResponseEntity.ok("Discount of " + percentage + "% applied to all products");
    }

    @Tag(name = "AdminDiscount")
    @Operation(summary = "Manually Reset All Product Discounts")
    @PostMapping("/reset")
    public ResponseEntity<String> resetAllDiscounts() {
        log.info("Manual reset of all product discounts");
        productDiscountService.resetAllProductDiscounts();

        return ResponseEntity.ok("All product discounts have been reset");
    }
}