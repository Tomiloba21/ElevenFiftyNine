package dev.lobzter.commerceservice.repository;

import dev.lobzter.commerceservice.model.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends MongoRepository<Cart,String> {

    Optional<Cart> findByUserId(String userId);
    // Delete cart by user ID
    void deleteByUserId(String userId);
}
