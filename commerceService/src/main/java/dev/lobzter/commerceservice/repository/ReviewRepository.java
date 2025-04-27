package dev.lobzter.commerceservice.repository;

import dev.lobzter.commerceservice.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository  extends MongoRepository<Review,String> {
}
