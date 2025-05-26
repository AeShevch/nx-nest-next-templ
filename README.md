# 🚀 Микросервисная архитектура: Nx + NestJS + NextJS + Go + gRPC

Полнофункциональная микросервисная архитектура, демонстрирующая взаимодействие между различными технологиями через gRPC.

## 🏗️ Архитектура

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │  User Service   │
│   (NextJS)      │◄──►│   (NestJS)      │◄──►│   (NestJS)      │
│   Port: 3000    │    │   Port: 3333    │    │   Port: 5001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        
                                ▼                        
                       ┌─────────────────┐    ┌─────────────────┐
                       │ Product Service │    │ Order Service   │
                       │   (NestJS)      │    │     (Go)        │
                       │   Port: 5002    │    │   Port: 5003    │
                       └─────────────────┘    └─────────────────┘
```

## 🛠️ Технологии

- **Frontend**: NextJS 15 с TypeScript
- **API Gateway**: NestJS с gRPC клиентами
- **User Service**: NestJS микросервис (gRPC)
- **Product Service**: NestJS микросервис (gRPC)
- **Order Service**: Go микросервис (gRPC)
- **Протоколы**: gRPC для межсервисного взаимодействия
- **Монорепозиторий**: Nx для управления проектом

## 📋 Сервисы

### 👥 User Service (NestJS - порт 5001)
- Управление пользователями
- CRUD операции через gRPC
- Тестовые данные: 3 пользователя

### 📦 Product Service (NestJS - порт 5002)  
- Управление продуктами
- CRUD операции через gRPC
- Тестовые данные: 3 продукта

### 🛒 Order Service (Go - порт 5003)
- Управление заказами
- CRUD операции через gRPC
- Тестовые данные: 3 заказа
- Реализован на Go для демонстрации полиглотной архитектуры

### 🌐 API Gateway (NestJS - порт 3333)
- Единая точка входа для всех API
- Проксирование запросов к микросервисам
- REST API endpoints: `/api/users`, `/api/products`, `/api/orders`

### 🖥️ Frontend (NextJS - порт 3000)
- Современный веб-интерфейс
- Вкладки для просмотра пользователей, продуктов и заказов
- Responsive дизайн

## 🚀 Быстрый запуск

### Автоматический запуск всех сервисов:

```bash
# Запуск всех сервисов одной командой
./start-all.sh

# Остановка всех сервисов
./stop-all.sh
```

### Ручной запуск:

```bash
# 1. Установка зависимостей
pnpm install

# 2. Установка Go зависимостей
cd order-service-go
go mod tidy
cd ..

# 3. Запуск сервисов (в отдельных терминалах)
npx nx serve user-service     # порт 5001
npx nx serve product-service  # порт 5002
npx nx serve api-gateway      # порт 3333
npx nx dev frontend          # порт 3000

# 4. Запуск Go сервиса
cd order-service-go
go run cmd/server/main.go    # порт 5003
```

## 📡 API Endpoints

### User Service
- `GET /api/users` - Получить всех пользователей
- `GET /api/users/:id` - Получить пользователя по ID
- `POST /api/users` - Создать пользователя
- `PUT /api/users/:id` - Обновить пользователя
- `DELETE /api/users/:id` - Удалить пользователя

### Product Service
- `GET /api/products` - Получить все продукты
- `GET /api/products/:id` - Получить продукт по ID
- `POST /api/products` - Создать продукт
- `PUT /api/products/:id` - Обновить продукт
- `DELETE /api/products/:id` - Удалить продукт

### Order Service (Go)
- `GET /api/orders` - Получить все заказы
- `GET /api/orders/:id` - Получить заказ по ID
- `POST /api/orders` - Создать заказ
- `PUT /api/orders/:id` - Обновить статус заказа
- `DELETE /api/orders/:id` - Удалить заказ

## 🧪 Тестирование

### Тестирование API:

```bash
# Пользователи
curl http://localhost:3333/api/users

# Продукты
curl http://localhost:3333/api/products

# Заказы
curl http://localhost:3333/api/orders

# Конкретный заказ
curl http://localhost:3333/api/orders/1
```

### Тестирование Go сервиса напрямую:

```bash
cd order-service-go
go run cmd/test_client/main.go
```

## 📁 Структура проекта

```
nx-nest-next-templ/
├── api-gateway/           # API Gateway (NestJS)
├── user-service/          # User микросервис (NestJS)
├── product-service/       # Product микросервис (NestJS)
├── order-service-go/      # Order микросервис (Go)
│   ├── cmd/
│   │   ├── server/        # Основной сервер
│   │   └── test_client/   # Тестовый клиент
│   ├── internal/
│   │   ├── model/         # Модели данных
│   │   └── service/       # Бизнес-логика
│   ├── proto/             # Сгенерированные proto файлы
│   └── Makefile           # Команды сборки
├── frontend/              # Frontend (NextJS)
├── proto/                 # Proto схемы
├── start-all.sh          # Скрипт запуска всех сервисов
├── stop-all.sh           # Скрипт остановки всех сервисов
└── logs/                 # Логи сервисов
```

## 🔧 Разработка

### Добавление нового микросервиса:

1. Создайте proto схему в `proto/`
2. Сгенерируйте код для нужного языка
3. Реализуйте сервис
4. Добавьте в API Gateway
5. Обновите frontend при необходимости

### Генерация proto файлов:

```bash
# Для TypeScript (NestJS)
protoc --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto \
       --ts_proto_out=./ \
       --ts_proto_opt=nestJs=true \
       proto/*.proto

# Для Go
cd order-service-go
make proto
```

## 📊 Мониторинг

- Логи всех сервисов сохраняются в папке `logs/`
- Каждый сервис имеет свой лог файл
- PID процессов сохраняются для управления

## 🎯 Особенности

- **Полиглотная архитектура**: NestJS + Go
- **Type-safe**: TypeScript интерфейсы для всех API
- **gRPC**: Эффективное межсервисное взаимодействие
- **Монорепозиторий**: Nx для управления зависимостями
- **Автоматизация**: Скрипты для запуска/остановки
- **Логирование**: Централизованные логи
- **Тестирование**: Готовые тестовые клиенты

## 🚀 Демо данные

### Пользователи:
- John Doe (john@example.com)
- Jane Smith (jane@example.com)  
- Bob Johnson (bob@example.com)

### Продукты:
- Laptop ($999.99)
- Smartphone ($699.99)
- Coffee Mug ($12.99)

### Заказы:
- Заказ #1: Laptop + Coffee Mug ($1025.97, confirmed)
- Заказ #2: Smartphone ($699.99, shipped)
- Заказ #3: Coffee Mug x5 ($64.95, pending)

## 🔗 Полезные ссылки

- [Nx Documentation](https://nx.dev)
- [NestJS Documentation](https://nestjs.com)
- [NextJS Documentation](https://nextjs.org)
- [gRPC Documentation](https://grpc.io)
- [Go Documentation](https://golang.org)

---

**Автор**: Создано для демонстрации современной микросервисной архитектуры
