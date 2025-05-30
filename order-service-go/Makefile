.PHONY: proto build run clean install-deps

# Генерация proto файлов
proto:
	@echo "🔧 Генерация Go кода из proto файлов..."
	@./generate-proto.sh

# Установка зависимостей
install-deps:
	@echo "📦 Установка зависимостей..."
	@go mod tidy
	@go mod download

# Сборка приложения
build: proto
	@echo "🔨 Сборка Order Service..."
	@go build -o bin/order-service cmd/server/main.go

# Запуск приложения
run: build
	@echo "🚀 Запуск Order Service на порту 5003..."
	@./bin/order-service

# Запуск в режиме разработки
dev: proto
	@echo "🔧 Запуск в режиме разработки..."
	@go run cmd/server/main.go

# Очистка
clean:
	@echo "🧹 Очистка..."
	@rm -rf bin/
	@rm -rf proto/*.pb.go

# Тестирование
test:
	@echo "🧪 Запуск тестов..."
	@go test ./...

# Форматирование кода
fmt:
	@echo "✨ Форматирование кода..."
	@go fmt ./...

# Проверка кода
lint:
	@echo "🔍 Проверка кода..."
	@go vet ./...

# Полная сборка с проверками
all: clean fmt lint proto build test
	@echo "✅ Сборка завершена успешно!" 