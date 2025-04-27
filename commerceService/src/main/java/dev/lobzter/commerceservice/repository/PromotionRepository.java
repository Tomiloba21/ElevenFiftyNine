package dev.lobzter.commerceservice.repository;


import dev.lobzter.commerceservice.model.Promotion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionRepository extends MongoRepository<Promotion, String> {
}
