package dev.lobzter.commerceservice.controller;


import dev.lobzter.commerceservice.dto.OrderDto;
import dev.lobzter.commerceservice.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${spring.data.rest.base-path}/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @Tag(name = "Order")
    @Operation(summary = "Create Order")
    @PostMapping
    public ResponseEntity<OrderDto.OrderResponse> createOrder(@Valid @RequestBody OrderDto.OrderRequest orderRequest) {
        OrderDto.OrderResponse createdOrder = orderService.createOrder(orderRequest);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    /**
     *todo => Impliment this later
     * @return
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderDto.OrderResponse> getOrder(@PathVariable String id) {
        OrderDto.OrderResponse order = orderService.getOrder(id);
        return ResponseEntity.ok(order);
    }


    @Tag(name = "Order")
    @Operation(summary = "Get All Order")
    @GetMapping
    public ResponseEntity<List<OrderDto.OrderResponse>> getAllOrders() {
        List<OrderDto.OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    /**
     * This also has some errors because the customers (User are not yet implemented)
     * @param customerId
     * @return
     */
    @Tag(name = "Order ")
    @Operation(summary = "Get Order By the Custsomer ")
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderDto.OrderResponse>> getOrdersByCustomer(@PathVariable String customerId) {
        List<OrderDto.OrderResponse> orders = orderService.getOrdersByCustomerId(customerId);
        return ResponseEntity.ok(orders);
    }

    @Tag(name = "Order")
    @Operation(summary = "Update the Order status ")
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderDto.OrderResponse> updateOrderStatus(
            @PathVariable String id,
            @Valid @RequestBody OrderDto.OrderStatusUpdateRequest statusUpdateRequest) {
        OrderDto.OrderResponse updatedOrder = orderService.updateOrderStatus(id, statusUpdateRequest);
        return ResponseEntity.ok(updatedOrder);
    }
}