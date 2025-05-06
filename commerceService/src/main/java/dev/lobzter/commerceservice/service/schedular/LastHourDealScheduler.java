package dev.lobzter.commerceservice.service.schedular;


import dev.lobzter.commerceservice.service.impl.ProductDiscountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Component
@RequiredArgsConstructor
@Slf4j
public class LastHourDealScheduler {

    private final ProductDiscountService productDiscountService;

    @Value("${app.last-hour-deal.start-time:23:00}")
    private String dealStartTime;

    @Value("${app.last-hour-deal.end-time:23:59}")
    private String dealEndTime;

    @Value("${app.last-hour-deal.discount-percentage:20}")
    private int discountPercentage;

    // Scheduled task that runs every minute to check if it's time to activate deals
    @Scheduled(cron = "0 * * * * *") // Run every minute
    public void checkAndActivateDeals() {
        LocalTime currentTime = LocalTime.now();
        LocalTime startTime = LocalTime.parse(dealStartTime, DateTimeFormatter.ofPattern("HH:mm"));

        // If current time is within 1 minute of deal start time
        if (currentTime.getHour() == startTime.getHour() &&
                currentTime.getMinute() == startTime.getMinute()) {

            log.info("Activating last hour deals at configured time: {}", dealStartTime);
            productDiscountService.applyDiscountToAllProducts(discountPercentage);
        }
    }

    // Scheduled task to reset prices at the configured end time
    @Scheduled(cron = "0 * * * * *") // Run every minute
    public void checkAndDeactivateDeals() {
        LocalTime currentTime = LocalTime.now();
        LocalTime endTime = LocalTime.parse(dealEndTime, DateTimeFormatter.ofPattern("HH:mm"));

        // If current time is within 1 minute of deal end time
        if (currentTime.getHour() == endTime.getHour() &&
                currentTime.getMinute() == endTime.getMinute()) {

            log.info("Deactivating last hour deals at configured time: {}", dealEndTime);
            productDiscountService.resetAllProductDiscounts();
        }
    }
}