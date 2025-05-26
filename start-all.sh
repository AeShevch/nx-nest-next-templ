#!/bin/bash

echo "🚀 Запуск микросервисной архитектуры Nx + NestJS + NextJS + Go + gRPC"
echo "=================================================================="

# Функция для проверки доступности порта
check_port() {
    local port=$1
    local service=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Порт $port уже занят ($service)"
        return 1
    else
        echo "✅ Порт $port свободен ($service)"
        return 0
    fi
}

# Проверяем доступность портов
echo "Проверка портов..."
check_port 5001 "User Service"
check_port 5002 "Product Service" 
check_port 5003 "Order Service (Go)"
check_port 3333 "API Gateway"
check_port 3000 "Frontend"

echo ""
echo "Запуск сервисов..."

# Запуск User Service
echo "🔵 Запуск User Service (порт 5001)..."
NX_DAEMON=false npx nx serve user-service > logs/user-service.log 2>&1 &
USER_PID=$!

# Ждем немного
sleep 3

# Запуск Product Service  
echo "🟢 Запуск Product Service (порт 5002)..."
NX_DAEMON=false npx nx serve product-service > logs/product-service.log 2>&1 &
PRODUCT_PID=$!

# Ждем немного
sleep 3

# Запуск Order Service (Go)
echo "🟡 Запуск Order Service Go (порт 5003)..."
cd order-service-go
go run cmd/server/main.go > ../logs/order-service.log 2>&1 &
ORDER_PID=$!
cd ..

# Ждем немного
sleep 5

# Запуск API Gateway
echo "🔴 Запуск API Gateway (порт 3333)..."
NX_DAEMON=false npx nx serve api-gateway > logs/api-gateway.log 2>&1 &
GATEWAY_PID=$!

# Ждем немного
sleep 8

# Запуск Frontend
echo "🟣 Запуск Frontend (порт 3000)..."
NX_DAEMON=false npx nx dev frontend > logs/frontend.log 2>&1 &
FRONTEND_PID=$!

echo ""
echo "=================================================================="
echo "✅ Все сервисы запущены!"
echo ""
echo "📋 Сервисы:"
echo "   👥 User Service:     http://localhost:5001"
echo "   📦 Product Service:  http://localhost:5002" 
echo "   🛒 Order Service:    http://localhost:5003"
echo "   🌐 API Gateway:      http://localhost:3333/api"
echo "   🖥️  Frontend:         http://localhost:3000"
echo ""
echo "📁 Логи сохраняются в папке logs/"
echo ""
echo "🛑 Для остановки всех сервисов запустите: ./stop-all.sh"
echo "   Или нажмите Ctrl+C для остановки этого скрипта"

# Создаем файл с PID процессов
mkdir -p logs
echo "$USER_PID" > logs/user-service.pid
echo "$PRODUCT_PID" > logs/product-service.pid  
echo "$ORDER_PID" > logs/order-service.pid
echo "$GATEWAY_PID" > logs/api-gateway.pid
echo "$FRONTEND_PID" > logs/frontend.pid

# Ждем сигнала завершения
trap 'echo ""; echo "🛑 Остановка всех сервисов..."; kill $USER_PID $PRODUCT_PID $ORDER_PID $GATEWAY_PID $FRONTEND_PID 2>/dev/null; exit' INT

# Бесконечный цикл для поддержания скрипта
while true; do
    sleep 1
done 