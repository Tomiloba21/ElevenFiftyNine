package dev.lobzter.commerceservice.repository;


import dev.lobzter.commerceservice.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String > {
    List<Order> findByCustomerId(String customerId);
}
