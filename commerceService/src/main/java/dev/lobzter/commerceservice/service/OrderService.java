package dev.lobzter.commerceservice.service;

import dev.lobzter.commerceservice.dto.OrderDto;

import java.util.List;

public interface OrderService {
    /**
     * Order Should Not be deleted(Until it has been delivered  / Updated
     * @param orderRequest
     * @return
     */

    OrderDto.OrderResponse createOrder(OrderDto.OrderRequest orderRequest);

    OrderDto.OrderResponse getOrder();

    OrderDto.OrderResponse getOrder(String id);

    OrderDto.OrderResponse updateOrderStatus(String orderId, OrderDto.OrderStatusUpdateRequest statusUpdateRequest);

    List<OrderDto.OrderResponse> getAllOrders();

    List<OrderDto.OrderResponse> getOrdersByCustomerId(String customerId);

}
