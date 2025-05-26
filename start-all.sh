#!/bin/bash

# Скрипт для запуска всех микросервисов
echo "🚀 Запуск микросервисной архитектуры..."

# Проверяем, установлены ли зависимости
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости..."
    pnpm install
fi

# Функция для запуска сервиса в новом терминале
start_service() {
    local service_name=$1
    local port=$2
    local command=$3
    
    echo "🔧 Запускаем $service_name на порту $port..."
    
    # Для macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osascript -e "tell application \"Terminal\" to do script \"cd $(pwd) && echo '🚀 Запуск $service_name на порту $port' && $command\""
    # Для Linux с gnome-terminal
    elif command -v gnome-terminal &> /dev/null; then
        gnome-terminal --tab --title="$service_name" -- bash -c "cd $(pwd) && echo '🚀 Запуск $service_name на порту $port' && $command; exec bash"
    # Для Linux с xterm
    elif command -v xterm &> /dev/null; then
        xterm -T "$service_name" -e "cd $(pwd) && echo '🚀 Запуск $service_name на порту $port' && $command; bash" &
    else
        echo "❌ Не удалось определить терминал. Запустите сервисы вручную:"
        echo "   $command"
    fi
}

echo ""
echo "🎯 Запускаем сервисы в отдельных терминалах..."
echo ""

# Запускаем микросервисы
start_service "User Service" "5001" "npx nx serve user-service"
sleep 2

start_service "Product Service" "5002" "npx nx serve product-service"
sleep 2

start_service "API Gateway" "3333" "npx nx serve api-gateway"
sleep 2

start_service "Frontend" "3000" "npx nx dev frontend"

echo ""
echo "✅ Все сервисы запущены!"
echo ""
echo "📋 Доступные адреса:"
echo "   🌐 Frontend:        http://localhost:3000"
echo "   🔗 API Gateway:     http://localhost:3333/api"
echo "   👥 User Service:    localhost:5001 (gRPC)"
echo "   📦 Product Service: localhost:5002 (gRPC)"
echo ""
echo "⏳ Подождите несколько секунд, пока все сервисы запустятся..."
echo "🎉 Затем откройте http://localhost:3000 в браузере"
echo ""
echo "🛑 Для остановки всех сервисов закройте все терминалы или нажмите Ctrl+C в каждом" 