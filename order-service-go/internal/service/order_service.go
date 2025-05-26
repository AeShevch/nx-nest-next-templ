package service

import (
	"context"
	"sync"
	"time"

	"order-service/internal/model"
	pb "order-service/proto"

	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// OrderService реализует gRPC сервис для управления заказами
type OrderService struct {
	pb.UnimplementedOrderServiceServer
	orders map[string]*model.Order
	mutex  sync.RWMutex
}

// NewOrderService создает новый экземпляр OrderService
func NewOrderService() *OrderService {
	service := &OrderService{
		orders: make(map[string]*model.Order),
	}
	
	// Добавляем тестовые данные
	service.seedTestData()
	
	return service
}

// seedTestData добавляет тестовые заказы
func (s *OrderService) seedTestData() {
	testOrders := []*model.Order{
		{
			ID:     "1",
			UserID: "1",
			Items: []model.OrderItem{
				{ProductID: "1", ProductName: "Laptop", Quantity: 1, Price: 999.99},
				{ProductID: "3", ProductName: "Coffee Mug", Quantity: 2, Price: 12.99},
			},
			TotalAmount: 1025.97,
			Status:      model.Status.Confirmed,
			CreatedAt:   time.Now().Add(-24 * time.Hour),
			UpdatedAt:   time.Now().Add(-24 * time.Hour),
		},
		{
			ID:     "2",
			UserID: "2",
			Items: []model.OrderItem{
				{ProductID: "2", ProductName: "Smartphone", Quantity: 1, Price: 699.99},
			},
			TotalAmount: 699.99,
			Status:      model.Status.Shipped,
			CreatedAt:   time.Now().Add(-12 * time.Hour),
			UpdatedAt:   time.Now().Add(-6 * time.Hour),
		},
		{
			ID:     "3",
			UserID: "1",
			Items: []model.OrderItem{
				{ProductID: "3", ProductName: "Coffee Mug", Quantity: 5, Price: 12.99},
			},
			TotalAmount: 64.95,
			Status:      model.Status.Pending,
			CreatedAt:   time.Now().Add(-2 * time.Hour),
			UpdatedAt:   time.Now().Add(-2 * time.Hour),
		},
	}

	for _, order := range testOrders {
		s.orders[order.ID] = order
	}
}

// CreateOrder создает новый заказ
func (s *OrderService) CreateOrder(ctx context.Context, req *pb.CreateOrderRequest) (*pb.OrderResponse, error) {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	if req.UserId == "" {
		return nil, status.Error(codes.InvalidArgument, "user_id is required")
	}

	if len(req.Items) == 0 {
		return nil, status.Error(codes.InvalidArgument, "at least one item is required")
	}

	// Создаем новый заказ
	order := &model.Order{
		ID:        uuid.New().String(),
		UserID:    req.UserId,
		Items:     make([]model.OrderItem, len(req.Items)),
		Status:    model.Status.Pending,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// Конвертируем элементы заказа и вычисляем общую сумму
	var totalAmount float64
	for i, item := range req.Items {
		order.Items[i] = model.OrderItem{
			ProductID:   item.ProductId,
			ProductName: item.ProductName,
			Quantity:    item.Quantity,
			Price:       item.Price,
		}
		totalAmount += item.Price * float64(item.Quantity)
	}
	order.TotalAmount = totalAmount

	// Сохраняем заказ
	s.orders[order.ID] = order

	return &pb.OrderResponse{
		Order: s.modelToProto(order),
	}, nil
}

// GetOrder получает заказ по ID
func (s *OrderService) GetOrder(ctx context.Context, req *pb.GetOrderRequest) (*pb.OrderResponse, error) {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	if req.Id == "" {
		return nil, status.Error(codes.InvalidArgument, "id is required")
	}

	order, exists := s.orders[req.Id]
	if !exists {
		return nil, status.Error(codes.NotFound, "order not found")
	}

	return &pb.OrderResponse{
		Order: s.modelToProto(order),
	}, nil
}

// UpdateOrder обновляет статус заказа
func (s *OrderService) UpdateOrder(ctx context.Context, req *pb.UpdateOrderRequest) (*pb.OrderResponse, error) {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	if req.Id == "" {
		return nil, status.Error(codes.InvalidArgument, "id is required")
	}

	order, exists := s.orders[req.Id]
	if !exists {
		return nil, status.Error(codes.NotFound, "order not found")
	}

	// Обновляем статус
	if req.Status != "" {
		order.Status = req.Status
		order.UpdatedAt = time.Now()
	}

	return &pb.OrderResponse{
		Order: s.modelToProto(order),
	}, nil
}

// DeleteOrder удаляет заказ
func (s *OrderService) DeleteOrder(ctx context.Context, req *pb.DeleteOrderRequest) (*pb.DeleteOrderResponse, error) {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	if req.Id == "" {
		return nil, status.Error(codes.InvalidArgument, "id is required")
	}

	_, exists := s.orders[req.Id]
	if !exists {
		return nil, status.Error(codes.NotFound, "order not found")
	}

	delete(s.orders, req.Id)

	return &pb.DeleteOrderResponse{
		Success: true,
		Message: "Order deleted successfully",
	}, nil
}

// GetOrders получает список заказов с пагинацией
func (s *OrderService) GetOrders(ctx context.Context, req *pb.GetOrdersRequest) (*pb.GetOrdersResponse, error) {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	page := req.Page
	if page <= 0 {
		page = 1
	}

	limit := req.Limit
	if limit <= 0 {
		limit = 10
	}

	// Фильтруем заказы по user_id если указан
	var filteredOrders []*model.Order
	for _, order := range s.orders {
		if req.UserId == "" || order.UserID == req.UserId {
			filteredOrders = append(filteredOrders, order)
		}
	}

	total := int32(len(filteredOrders))

	// Применяем пагинацию
	start := (page - 1) * limit
	end := start + limit

	if start >= total {
		return &pb.GetOrdersResponse{
			Orders: []*pb.Order{},
			Total:  total,
			Page:   page,
			Limit:  limit,
		}, nil
	}

	if end > total {
		end = total
	}

	// Конвертируем в proto
	protoOrders := make([]*pb.Order, end-start)
	for i := start; i < end; i++ {
		protoOrders[i-start] = s.modelToProto(filteredOrders[i])
	}

	return &pb.GetOrdersResponse{
		Orders: protoOrders,
		Total:  total,
		Page:   page,
		Limit:  limit,
	}, nil
}

// modelToProto конвертирует модель заказа в protobuf сообщение
func (s *OrderService) modelToProto(order *model.Order) *pb.Order {
	items := make([]*pb.OrderItem, len(order.Items))
	for i, item := range order.Items {
		items[i] = &pb.OrderItem{
			ProductId:   item.ProductID,
			ProductName: item.ProductName,
			Quantity:    item.Quantity,
			Price:       item.Price,
		}
	}

	return &pb.Order{
		Id:          order.ID,
		UserId:      order.UserID,
		Items:       items,
		TotalAmount: order.TotalAmount,
		Status:      order.Status,
		CreatedAt:   order.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   order.UpdatedAt.Format(time.RFC3339),
	}
} 