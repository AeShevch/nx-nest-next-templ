package main

import (
	"context"
	"log"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	pb "order-service/proto"
)

func main() {
	// Подключение к серверу
	conn, err := grpc.Dial("localhost:5003", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Failed to connect: %v", err)
	}
	defer conn.Close()

	client := pb.NewOrderServiceClient(conn)
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	// Тест получения всех заказов
	log.Println("Testing GetOrders...")
	ordersResp, err := client.GetOrders(ctx, &pb.GetOrdersRequest{
		Page:  1,
		Limit: 10,
	})
	if err != nil {
		log.Fatalf("GetOrders failed: %v", err)
	}

	log.Printf("Found %d orders:", len(ordersResp.Orders))
	for _, order := range ordersResp.Orders {
		log.Printf("Order ID: %s, User: %s, Status: %s, Total: $%.2f",
			order.Id, order.UserId, order.Status, order.TotalAmount)
	}

	// Тест получения конкретного заказа
	if len(ordersResp.Orders) > 0 {
		firstOrderId := ordersResp.Orders[0].Id
		log.Printf("\nTesting GetOrder for ID: %s", firstOrderId)
		
		orderResp, err := client.GetOrder(ctx, &pb.GetOrderRequest{
			Id: firstOrderId,
		})
		if err != nil {
			log.Fatalf("GetOrder failed: %v", err)
		}

		order := orderResp.Order
		log.Printf("Order details: ID=%s, User=%s, Status=%s, Items=%d",
			order.Id, order.UserId, order.Status, len(order.Items))
		
		for i, item := range order.Items {
			log.Printf("  Item %d: %s x%d = $%.2f",
				i+1, item.ProductName, item.Quantity, item.Price)
		}
	}

	log.Println("\nGo service test completed successfully!")
} 