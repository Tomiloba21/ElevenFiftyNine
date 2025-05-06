package dev.lobzter.commerceservice.service.schedular;

import dev.lobzter.commerceservice.dto.OrderDto;
import dev.lobzter.commerceservice.model.Order;
import dev.lobzter.commerceservice.model.enums.OrderStatus;
import dev.lobzter.commerceservice.repository.OrderRepository;
import dev.lobzter.commerceservice.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderScheduler {

    private final OrderRepository orderRepository;
    private final OrderService orderService;

    /**
     * Automatically process pending orders every 15 minutes
     * This could be triggered by payment confirmation from a payment gateway
     */
    @Scheduled(fixedRate = 900000) // 15 minutes in milliseconds
    public void processPendingOrders() {
        log.info("Starting scheduled task: Processing pending orders");

        List<Order> pendingOrders = orderRepository.findByStatus(OrderStatus.PENDING);

        for(Order order : pendingOrders) {
            // In a real-world scenario, we would check payment status with payment gateway
            // For demo purposes, we'll assume payment was successful if order is more than 5 minutes old
            if(order.getOrderDate().isBefore(LocalDateTime.now().minusMinutes(5))) {
                log.info("Auto-processing order: {}", order.getOrderNumber());

                OrderDto.OrderStatusUpdateRequest statusUpdate = new OrderDto.OrderStatusUpdateRequest();
                statusUpdate.setStatus(OrderStatus.PROCESSING);

                try {
                    orderService.updateOrderStatus(order.getId(), statusUpdate);
                    log.info("Successfully processed order: {}", order.getOrderNumber());
                } catch (Exception e) {
                    log.error("Failed to process order {}: {}", order.getOrderNumber(), e.getMessage());
                }
            }
        }

        log.info("Completed scheduled task: Processed {} pending orders", pendingOrders.size());
    }

    /**
     * Generate tracking numbers for orders in PROCESSING state
     * In a real application, this would integrate with shipping carriers
     */
    @Scheduled(cron = "0 0 */2 * * *") // Every 2 hours
    public void generateTrackingNumbers() {
        log.info("Starting scheduled task: Generating tracking numbers");

        List<Order> processingOrders = orderRepository.findByStatus(OrderStatus.PROCESSING);

        for(Order order : processingOrders) {
            // Check if order has been in PROCESSING state for more than 1 hour
            if(order.getOrderDate().isBefore(LocalDateTime.now().minusHours(1))) {
                String trackingNumber = generateTrackingNumber();
                log.info("Generating tracking number for order {}: {}", order.getOrderNumber(), trackingNumber);

                OrderDto.OrderStatusUpdateRequest statusUpdate = new OrderDto.OrderStatusUpdateRequest();
                statusUpdate.setStatus(OrderStatus.SHIPPED);
                statusUpdate.setTrackingNumber(trackingNumber);

                try {
                    orderService.updateOrderStatus(order.getId(), statusUpdate);
                    log.info("Successfully shipped order: {}", order.getOrderNumber());
                } catch (Exception e) {
                    log.error("Failed to update tracking for order {}: {}", order.getOrderNumber(), e.getMessage());
                }
            }
        }

        log.info("Completed scheduled task: Generated tracking numbers for {} orders", processingOrders.size());
    }

    /**
     * Check for orders that should be marked as delivered
     * In a real application, this would integrate with shipping carriers' APIs
     */
    @Scheduled(cron = "0 0 12 * * *") // Every day at noon
    public void checkDeliveredOrders() {
        log.info("Starting scheduled task: Checking for delivered orders");

        List<Order> shippedOrders = orderRepository.findByStatus(OrderStatus.SHIPPED);

        for(Order order : shippedOrders) {
            // For demo purposes, mark as delivered if shipped more than 3 days ago
            if(order.getShippedDate() != null &&
                    order.getShippedDate().isBefore(LocalDateTime.now().minusDays(3))) {

                log.info("Marking order as delivered: {}", order.getOrderNumber());

                OrderDto.OrderStatusUpdateRequest statusUpdate = new OrderDto.OrderStatusUpdateRequest();
                statusUpdate.setStatus(OrderStatus.DELIVERED);

                try {
                    orderService.updateOrderStatus(order.getId(), statusUpdate);
                    log.info("Successfully marked order as delivered: {}", order.getOrderNumber());
                } catch (Exception e) {
                    log.error("Failed to mark order as delivered {}: {}", order.getOrderNumber(), e.getMessage());
                }
            }
        }

        log.info("Completed scheduled task: Checked for delivered orders");
    }

    /**
     * Generate a shipping tracking number
     * In a real application, this would come from the shipping carrier's API
     */
    private String generateTrackingNumber() {
        return "TRK-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
    }
}