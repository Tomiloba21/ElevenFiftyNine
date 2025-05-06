package dev.lobzter.commerceservice.repository;


import dev.lobzter.commerceservice.model.Order;
import dev.lobzter.commerceservice.model.enums.OrderStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<Order, String > {
    List<Order> findByCustomerId(String customerId);

    List<Order> findByStatus(OrderStatus status);

    List<Order> findByStatusAndOrderDateBefore(OrderStatus status, java.time.LocalDateTime date);
}
