package model

import (
	"time"
)

// Order представляет заказ
type Order struct {
	ID          string      `json:"id"`
	UserID      string      `json:"user_id"`
	Items       []OrderItem `json:"items"`
	TotalAmount float64     `json:"total_amount"`
	Status      string      `json:"status"`
	CreatedAt   time.Time   `json:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at"`
}

// OrderItem представляет элемент заказа
type OrderItem struct {
	ProductID   string  `json:"product_id"`
	ProductName string  `json:"product_name"`
	Quantity    int32   `json:"quantity"`
	Price       float64 `json:"price"`
}

// OrderStatus содержит возможные статусы заказа
type OrderStatus struct {
	Pending   string
	Confirmed string
	Shipped   string
	Delivered string
	Cancelled string
}

// Статусы заказов
var Status = OrderStatus{
	Pending:   "pending",
	Confirmed: "confirmed",
	Shipped:   "shipped",
	Delivered: "delivered",
	Cancelled: "cancelled",
}