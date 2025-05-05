package dev.lobzter.commerceservice.service;

import dev.lobzter.commerceservice.dto.CartDto;

public interface CartService {



    CartDto.CartResponse createCart(String userId);

    CartDto.CartResponse getCart(String userId);

    CartDto.CartResponse addItemToCart(String userId, CartDto.CartRequest cartRequest);

    CartDto.CartResponse updateCartItem(String userId, CartDto.CartUpdateRequest updateRequest);

    CartDto.CartResponse removeCartItem(String userId, String itemId);

    void clearCart(String userId);


}
