#!/bin/bash

echo "🛑 Остановка всех сервисов микросервисной архитектуры..."
echo "======================================================="

# Функция для остановки процесса по PID файлу
stop_service() {
    local service_name=$1
    local pid_file="logs/$2.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "🔴 Остановка $service_name (PID: $pid)..."
            kill $pid 2>/dev/null
            sleep 2
            # Если процесс все еще работает, принудительно убиваем
            if ps -p $pid > /dev/null 2>&1; then
                echo "⚡ Принудительная остановка $service_name..."
                kill -9 $pid 2>/dev/null
            fi
        else
            echo "⚠️  $service_name уже остановлен"
        fi
        rm -f "$pid_file"
    else
        echo "⚠️  PID файл для $service_name не найден"
    fi
}

# Останавливаем сервисы
stop_service "User Service" "user-service"
stop_service "Product Service" "product-service"
stop_service "Order Service (Go)" "order-service"
stop_service "API Gateway" "api-gateway"
stop_service "Frontend" "frontend"

# Дополнительная очистка - убиваем все процессы по имени
echo ""
echo "🧹 Дополнительная очистка процессов..."

# Убиваем все nx serve процессы
pkill -f "nx serve" 2>/dev/null && echo "✅ Остановлены все nx serve процессы"

# Убиваем Go сервис
pkill -f "go run cmd/server/main.go" 2>/dev/null && echo "✅ Остановлен Go сервис"

# Убиваем процессы на портах
for port in 3000 3333 5001 5002 5003; do
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo "🔴 Освобождение порта $port (PID: $pid)..."
        kill $pid 2>/dev/null
        sleep 1
        # Принудительно если нужно
        if lsof -ti:$port >/dev/null 2>&1; then
            kill -9 $pid 2>/dev/null
        fi
    fi
done

echo ""
echo "✅ Все сервисы остановлены!"
echo "📁 Логи сохранены в папке logs/"
echo "" 