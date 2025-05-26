# Order Service (Go)

Микросервис для управления заказами, написанный на Go с использованием gRPC.

## Особенности

- ✅ gRPC API для управления заказами
- ✅ In-memory хранилище данных
- ✅ Тестовые данные для демонстрации
- ✅ Валидация входных данных
- ✅ Пагинация результатов
- ✅ Фильтрация по пользователю
- ✅ Thread-safe операции

## Требования

- Go 1.21+
- Protocol Buffers compiler (protoc)
- protoc-gen-go
- protoc-gen-go-grpc

## Установка зависимостей

### macOS (с Homebrew)
```bash
# Установка protoc
brew install protobuf

# Установка Go плагинов
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

### Ubuntu/Debian
```bash
# Установка protoc
sudo apt update
sudo apt install -y protobuf-compiler

# Установка Go плагинов
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

## Быстрый старт

### 1. Установка зависимостей Go
```bash
make install-deps
```

### 2. Генерация proto файлов
```bash
make proto
```

### 3. Запуск сервиса
```bash
# Режим разработки
make dev

# Или сборка и запуск
make run
```

Сервис будет доступен на порту **5003**.

## API

### Методы gRPC

- `CreateOrder` - Создание нового заказа
- `GetOrder` - Получение заказа по ID
- `UpdateOrder` - Обновление статуса заказа
- `DeleteOrder` - Удаление заказа
- `GetOrders` - Получение списка заказов с пагинацией

### Тестовые данные

Сервис автоматически создает тестовые заказы:

1. **Заказ #1** (пользователь 1): Laptop + Coffee Mug - $1025.97 (confirmed)
2. **Заказ #2** (пользователь 2): Smartphone - $699.99 (shipped)
3. **Заказ #3** (пользователь 1): Coffee Mug x5 - $64.95 (pending)

## Команды Makefile

```bash
make proto        # Генерация Go кода из proto файлов
make install-deps # Установка зависимостей
make build        # Сборка приложения
make run          # Сборка и запуск
make dev          # Запуск в режиме разработки
make test         # Запуск тестов
make fmt          # Форматирование кода
make lint         # Проверка кода
make clean        # Очистка сборочных файлов
make all          # Полная сборка с проверками
```

## Структура проекта

```
order-service-go/
├── cmd/server/           # Точка входа приложения
│   └── main.go
├── internal/
│   ├── model/           # Модели данных
│   │   └── order.go
│   └── service/         # Бизнес-логика
│       └── order_service.go
├── proto/               # Сгенерированные proto файлы
├── go.mod              # Go модуль
├── Makefile            # Команды сборки
├── generate-proto.sh   # Скрипт генерации proto
└── README.md
```

## Интеграция с API Gateway

Для интеграции с NestJS API Gateway добавьте клиент в `api-gateway/src/app/app.module.ts`:

```typescript
{
  name: 'ORDER_PACKAGE',
  transport: Transport.GRPC,
  options: {
    package: 'order',
    protoPath: join(process.cwd(), 'proto/order.proto'),
    url: '0.0.0.0:5003',
  },
}
```

## Отладка

Сервис поддерживает gRPC reflection, что позволяет использовать инструменты вроде:

- [grpcurl](https://github.com/fullstorydev/grpcurl)
- [BloomRPC](https://github.com/bloomrpc/bloomrpc)
- [Postman](https://www.postman.com/) (с поддержкой gRPC)

### Пример использования grpcurl

```bash
# Список доступных сервисов
grpcurl -plaintext localhost:5003 list

# Список методов сервиса
grpcurl -plaintext localhost:5003 list order.OrderService

# Получение всех заказов
grpcurl -plaintext -d '{"page": 1, "limit": 10}' \
  localhost:5003 order.OrderService/GetOrders
```

## Производительность

- Использует sync.RWMutex для thread-safe операций
- In-memory хранилище для быстрого доступа к данным
- Эффективная сериализация через Protocol Buffers
- Минимальные аллокации памяти

## Мониторинг

Для продакшена рекомендуется добавить:

- Логирование (logrus, zap)
- Метрики (Prometheus)
- Трейсинг (Jaeger, OpenTelemetry)
- Health checks
- Graceful shutdown 