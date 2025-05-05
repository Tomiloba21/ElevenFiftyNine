package dev.lobzter.commerceservice.service.impl;

import dev.lobzter.commerceservice.dto.CartDto;
import dev.lobzter.commerceservice.dto.CartItemDto;
import dev.lobzter.commerceservice.dto.ProductDto;
import dev.lobzter.commerceservice.exceptions.CartException;
import dev.lobzter.commerceservice.model.Cart;
import dev.lobzter.commerceservice.repository.CartRepository;
import dev.lobzter.commerceservice.service.CartService;
import dev.lobzter.commerceservice.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductService productService;
    private final UserService userService;

    @Override
    public CartDto.CartResponse createCart(String userId) {

        boolean idExists = userService.idExists(userId);


        if (idExists) {
            Cart cart = Cart.builder()
                    .userId(userId)
                    .items(new ArrayList<>())
                    .totalPrice(BigDecimal.ZERO)
                    .build();

            Cart savedCart = cartRepository.save(cart);
            return mapToCartResponse(savedCart);

        }else {
            throw new CartException("User does not Exist");
        }
    }

    @Override
    public CartDto.CartResponse getCart(String userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new CartException("Cart not found for user: " + userId));

        return mapToCartResponse(cart);
    }

    @Override
    public CartDto.CartResponse addItemToCart(String userId, CartDto.CartRequest cartRequest) {
        // Get the product details to ensure it exists and is in stock
        ProductDto.ProductResponse product = productService.getProduct(cartRequest.getProductId());

        // Validate stock quantity
        if (product.getStockQuantity() < cartRequest.getQuantity()) {
            throw new CartException("Not enough stock available for product: " + product.getName());
        }



        // Get or create cart for user
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .userId(userId)
                            .items(new ArrayList<>())
                            .totalPrice(BigDecimal.ZERO)
                            .build();
                    return cartRepository.save(newCart);
                });

        // Check if the item already exists in the cart with the same color and size
        Optional<Cart.CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(cartRequest.getProductId()))
                .findFirst();

        if (existingItem.isPresent()) {
            // Update quantity if item already exists
            Cart.CartItem item = existingItem.get();

            // Check if updated quantity exceeds stock
            int newQuantity = item.getQuantity() + cartRequest.getQuantity();
            if (product.getStockQuantity() < newQuantity) {
                throw new CartException("Cannot add more items than available in stock");
            }

            item.setQuantity(newQuantity);
        } else {
            // Add new item to cart
            Cart.CartItem newItem = Cart.CartItem.builder()
                    .id(UUID.randomUUID().toString()) // Generate unique ID for the cart item
                    .productId(product.getId())
                    .quantity(cartRequest.getQuantity())
                    .price(product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice())

                    .build();

            cart.getItems().add(newItem);
        }

        // Update total price
        updateCartTotalPrice(cart);

        Cart updatedCart = cartRepository.save(cart);
        return mapToCartResponse(updatedCart);
    }

    @Override
    public CartDto.CartResponse updateCartItem(String userId, CartDto.CartUpdateRequest updateRequest) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new CartException("Cart not found for user: " + userId));

        Cart.CartItem itemToUpdate = cart.getItems().stream()
                .filter(item -> item.getId().equals(updateRequest.getItemId()))
                .findFirst()
                .orElseThrow(() -> new CartException("Item not found in cart: " + updateRequest.getItemId()));

        // Ensure requested quantity doesn't exceed stock
        ProductDto.ProductResponse product = productService.getProduct(itemToUpdate.getProductId());
        if (product.getStockQuantity() < updateRequest.getQuantity()) {
            throw new CartException("Requested quantity exceeds available stock for: " + product.getName());
        }

        // Update quantity
        itemToUpdate.setQuantity(updateRequest.getQuantity());

        // Update total price
        updateCartTotalPrice(cart);

        Cart updatedCart = cartRepository.save(cart);
        return mapToCartResponse(updatedCart);
    }

    @Override
    public CartDto.CartResponse removeCartItem(String userId, String itemId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new CartException("Cart not found for user: " + userId));

        boolean removed = cart.getItems().removeIf(item -> item.getId().equals(itemId));

        if (!removed) {
            throw new CartException("Item not found in cart: " + itemId);
        }

        // Update total price
        updateCartTotalPrice(cart);

        Cart updatedCart = cartRepository.save(cart);
        return mapToCartResponse(updatedCart);
    }

    @Override
    public void clearCart(String userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new CartException("Cart not found for user: " + userId));

        cart.getItems().clear();
        cart.setTotalPrice(BigDecimal.ZERO);

        cartRepository.save(cart);
    }

    private void updateCartTotalPrice(Cart cart) {
        BigDecimal totalPrice = cart.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalPrice(totalPrice);
    }

    private CartDto.CartResponse mapToCartResponse(Cart cart) {
        List<CartItemDto> itemDtos = cart.getItems().stream()
                .map(this::mapToCartItemDto)
                .collect(Collectors.toList());

        int itemCount = itemDtos.stream()
                .mapToInt(CartItemDto::getQuantity)
                .sum();

        return CartDto.CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUserId())
                .items(itemDtos)
                .subtotal(cart.getTotalPrice())
                .itemCount(itemCount)
                .build();
    }

    private CartItemDto mapToCartItemDto(Cart.CartItem cartItem) {
        return CartItemDto.builder()
                .id(cartItem.getId())
                .productId(cartItem.getProductId())
                .quantity(cartItem.getQuantity())
                .price(cartItem.getPrice())
                .build();
    }
}