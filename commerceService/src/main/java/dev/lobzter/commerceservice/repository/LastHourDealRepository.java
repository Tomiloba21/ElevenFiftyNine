package dev.lobzter.commerceservice.repository;

import dev.lobzter.commerceservice.model.LastHourDeal;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LastHourDealRepository extends MongoRepository<LastHourDeal,String> {
}
