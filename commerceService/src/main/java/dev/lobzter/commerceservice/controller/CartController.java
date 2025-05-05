package dev.lobzter.commerceservice.controller;

import dev.lobzter.commerceservice.dto.CartDto;
import dev.lobzter.commerceservice.exceptions.CartException;
import dev.lobzter.commerceservice.service.impl.CartServiceImpl;
import dev.lobzter.commerceservice.service.impl.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartServiceImpl cartService;
    private final UserService userService;

    @Tag(name = "Cart")
    @Operation(summary = "Get User Cart")
    @GetMapping
    public ResponseEntity<?> getUserCart(@RequestHeader("X-User-Id") String userId) {
        log.info("Fetching cart for user: {}", userId);
        try {
            if (userService.idExists(userId)) {
                CartDto.CartResponse cart = cartService.getCart(userId);
                log.info("Cart found for user: {}", userId);
                return ResponseEntity.ok(cart);
            }else {
               return ResponseEntity.badRequest().body("User does not Exists");
            }
        } catch (CartException e) {
            // If the cart doesn't exist, create a new one
            log.error("Cart not found for user: {}. Creating new cart.", userId);
            if (e.getMessage().contains("not found")) {
                CartDto.CartResponse newCart = cartService.createCart(userId);
                log.info("New cart created for user: {}", userId);
                return ResponseEntity.ok(newCart);
            }
            // Re-throw the exception if it's another type of error
            log.error("Error fetching cart: ", e);
            throw e;
        }
    }

    @Tag(name = "Cart")
    @Operation(summary = "Add Item to Cart")
    @PostMapping("/items")
    public ResponseEntity<CartDto.CartResponse> addItemToCart(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody CartDto.CartRequest request) {
        log.info("Adding item to cart for user: {}, Item: {}", userId, request);
        CartDto.CartResponse updatedCart = cartService.addItemToCart(userId, request);
        log.info("Item added to cart for user: {}", userId);
        return ResponseEntity.ok(updatedCart);
    }

    @Tag(name = "Cart")
    @Operation(summary = "Update Cart Item")
    @PutMapping("/items")
    public ResponseEntity<CartDto.CartResponse> updateCartItem(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody CartDto.CartUpdateRequest request) {
        log.info("Updating cart item for user: {}, Item: {}", userId, request);
        CartDto.CartResponse updatedCart = cartService.updateCartItem(userId, request);
        log.info("Cart item updated for user: {}", userId);
        return ResponseEntity.ok(updatedCart);
    }

    @Tag(name = "Cart")
    @Operation(summary = "Remove Item from Cart")
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDto.CartResponse> removeCartItem(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String itemId) {
        log.info("Removing item from cart for user: {}, Item: {}", userId, itemId);
        CartDto.CartResponse updatedCart = cartService.removeCartItem(userId, itemId);
        log.info("Item removed from cart for user: {}", userId);
        return ResponseEntity.ok(updatedCart);
    }

    @Tag(name = "Cart")
    @Operation(summary = "Clear User Cart")
    @DeleteMapping
    public ResponseEntity<Void> clearCart(@RequestHeader("X-User-Id") String userId) {
        log.info("Clearing cart for user: {}", userId);
        cartService.clearCart(userId);
        log.info("Cart cleared for user: {}", userId);
        return ResponseEntity.noContent().build();
    }
}
