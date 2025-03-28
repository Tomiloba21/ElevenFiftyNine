package dev.lobzter.commerceservice.repository;

import dev.lobzter.commerceservice.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;


@Repository
public interface ProductRepository extends MongoRepository<Product,String> {
    List<Product> findByNameContaining(String name);
    List<Product> findByCategoriesContaining(String category);
    List<Product> findByPriceLessThan(BigDecimal price);
}
