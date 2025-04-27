package dev.lobzter.commerceservice.repository;


import dev.lobzter.commerceservice.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String > {
}
