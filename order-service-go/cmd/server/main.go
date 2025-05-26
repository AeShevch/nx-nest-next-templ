package main

import (
	"log"
	"net"

	"order-service/internal/service"
	pb "order-service/proto"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

const (
	port = ":5003"
)

func main() {
	// Создаем TCP listener
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("❌ Failed to listen on port %s: %v", port, err)
	}

	// Создаем gRPC сервер
	grpcServer := grpc.NewServer()

	// Регистрируем наш сервис
	orderService := service.NewOrderService()
	pb.RegisterOrderServiceServer(grpcServer, orderService)

	// Включаем reflection для удобства отладки
	reflection.Register(grpcServer)

	log.Printf("🚀 Order Service (Go) is running on: 0.0.0.0%s", port)
	log.Printf("📦 gRPC reflection enabled for debugging")

	// Запускаем сервер
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("❌ Failed to serve gRPC server: %v", err)
	}
} 