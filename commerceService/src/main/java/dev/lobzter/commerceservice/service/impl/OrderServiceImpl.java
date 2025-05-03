package dev.lobzter.commerceservice.service.impl;


import dev.lobzter.commerceservice.dto.OrderDto;
import dev.lobzter.commerceservice.dto.OrderItemDto;
import dev.lobzter.commerceservice.exceptions.ResourceNotFoundException;
import dev.lobzter.commerceservice.model.Order;
import dev.lobzter.commerceservice.model.Product;
import dev.lobzter.commerceservice.model.enums.OrderStatus;
import dev.lobzter.commerceservice.model.enums.PaymentMethod;
import dev.lobzter.commerceservice.repository.OrderRepository;
import dev.lobzter.commerceservice.repository.ProductRepository;
import dev.lobzter.commerceservice.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public OrderDto.OrderResponse createOrder(OrderDto.OrderRequest orderRequest) {
        // Generate order number
        String orderNumber = generateOrderNumber();

        // Calculate order amounts and prepare order items
        List<Order.OrderItem> orderItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderItemDto itemDto : orderRequest.getOrderItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemDto.getProductId()));

            // Verify product availability and quantity
            if (product.getStockQuantity() < itemDto.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
            }

            // Calculate item price
            BigDecimal itemPrice = product.getPrice().multiply(new BigDecimal(itemDto.getQuantity()));
            subtotal = subtotal.add(itemPrice);

            // Create order item
            Order.OrderItem orderItem = Order.OrderItem.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .quantity(itemDto.getQuantity())
                    .unitPrice(product.getPrice())
                    .totalPrice(itemPrice)
                    .build();

            orderItems.add(orderItem);

            // Update product stock
            product.setStockQuantity(product.getStockQuantity() - itemDto.getQuantity());
            productRepository.save(product);
        }

        // Calculate tax, shipping, and total
        BigDecimal taxAmount = calculateTax(subtotal);
        BigDecimal shippingCost = calculateShippingCost(orderItems);
        BigDecimal discountAmount = BigDecimal.ZERO; // Logic for applying coupon can be added here

        if (orderRequest.getCouponCode() != null && !orderRequest.getCouponCode().isEmpty()) {
            discountAmount = applyDiscount(subtotal, orderRequest.getCouponCode());
        }

        BigDecimal totalAmount = subtotal.add(taxAmount).add(shippingCost).subtract(discountAmount);

        // Set payment method
        PaymentMethod paymentMethod = PaymentMethod.valueOf(orderRequest.getPaymentMethod().toUpperCase());

        // Create order
        Order order = Order.builder()
                .orderNumber(orderNumber)
                .status(OrderStatus.PENDING)
                .customerId(orderRequest.getCustomerId())
                .subtotal(subtotal)
                .shippingCost(shippingCost)
                .taxAmount(taxAmount)
                .discountAmount(discountAmount)
                .totalAmount(totalAmount)
                .orderDate(LocalDateTime.now())
                .orderItems(orderItems)
                .shippingAddress(orderRequest.getShippingAddress())
                .paymentMethod(paymentMethod)
                .build();

        // Save order
        Order savedOrder = orderRepository.save(order);

        return mapToDto(savedOrder);
    }

    @Override
    public OrderDto.OrderResponse getOrder() {
        return null;
    }

    @Override
    public OrderDto.OrderResponse getOrder(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return mapToDto(order);
    }

    @Override
    public OrderDto.OrderResponse updateOrderStatus(String orderId, OrderDto.OrderStatusUpdateRequest statusUpdateRequest) {

        /**
         * A schedular that lets us change the order service form pending ( joins the queue, then when it converst to procesing , we generate a unique trackingnumber , once it has been delivered by our vendor , it goes to delivered
         * note => once it has been shipped , it cannot be cancelled or refunded
         */
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        order.setStatus(statusUpdateRequest.getStatus());

        if (statusUpdateRequest.getTrackingNumber() != null) {
            order.setTrackingNumber(statusUpdateRequest.getTrackingNumber());
        }

        if (statusUpdateRequest.getStatus() == OrderStatus.SHIPPED) {
            order.setShippedDate(LocalDateTime.now());
        } else if (statusUpdateRequest.getStatus() == OrderStatus.DELIVERED) {
            order.setDeliveredDate(LocalDateTime.now());
        }

        Order updatedOrder = orderRepository.save(order);
        return mapToDto(updatedOrder);
    }

    @Override
    public List<OrderDto.OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDto.OrderResponse> getOrdersByCustomerId(String customerId) {

        return orderRepository.findByCustomerId(customerId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private OrderDto.OrderResponse mapToDto(Order order) {
        List<OrderItemDto> orderItemDtos = order.getOrderItems().stream()
                .map(item -> OrderItemDto.builder()
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .totalPrice(item.getTotalPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderDto.OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerId(order.getCustomerId())
                .status(order.getStatus())
                .subtotal(order.getSubtotal())
                .shippingCost(order.getShippingCost())
                .taxAmount(order.getTaxAmount())
                .discountAmount(order.getDiscountAmount())
                .totalAmount(order.getTotalAmount())
                .orderDate(order.getOrderDate())
                .orderItems(orderItemDtos)
                .shippingAddress(order.getShippingAddress())
                .paymentId(order.getPaymentId())
                .paymentMethod(order.getPaymentMethod())
                .trackingNumber(order.getTrackingNumber())
                .shippedDate(order.getShippedDate())
                .deliveredDate(order.getDeliveredDate())
                .build();
    }

    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private BigDecimal calculateTax(BigDecimal subtotal) {
        // Simple tax calculation (10%)
        // using env to set it dynamically
        return subtotal.multiply(new BigDecimal("0.10"));
    }

    private BigDecimal calculateShippingCost(List<Order.OrderItem> orderItems) {
        // Simple flat rate shipping
        return new BigDecimal("9.99");
    }

    private BigDecimal applyDiscount(BigDecimal subtotal, String couponCode) {
        // Simple discount logic (10% off)
        // In a real application, this would check against a coupon database
        if ("DISCOUNT10".equals(couponCode)) {
            return subtotal.multiply(new BigDecimal("0.10"));
        }
        return BigDecimal.ZERO;
    }


//
//    private OrderDto.OrderResponse mapToDto(Order order){
//        return OrderDto.OrderResponse.builder()
//                .id(order.getId())
//                .orderNumber(order.getOrderNumber())
//                .status(order.getStatus())
////                .subtotal()
//                .shippingCost(order.getShippingCost())
//                .taxAmount(order.getTaxAmount())
//                .orderDate(order.getOrderDate())
//                .orderItems(order.getOrderItems())
//                .shippingAddress(order.getShippingAddress())
//                .paymentId(order.getPaymentId())
//                .paymentMethod(order.getPaymentMethod())
//                .trackingNumber(order.getTrackingNumber())
//                .trackingNumber(order.getTrackingNumber())
//                .shippedDate(order.getShippedDate())
//                .deliveredDate(order.getDeliveredDate())
//                .build();
//    }
}
