# Микросервисная архитектура: Nx + NestJS + NextJS + gRPC

Этот проект демонстрирует современную микросервисную архитектуру с использованием:

- **Nx** - монорепозиторий и инструменты разработки
- **NestJS** - фреймворк для создания микросервисов
- **NextJS** - React фреймворк для фронтенда
- **gRPC** - высокопроизводительный RPC фреймворк
- **pnpm** - быстрый менеджер пакетов

## Архитектура

```
┌─────────────────┐    HTTP     ┌─────────────────┐    gRPC    ┌─────────────────┐
│                 │   REST API  │                 │            │                 │
│   NextJS        │◄───────────►│   API Gateway   │◄──────────►│  User Service   │
│   Frontend      │             │   (NestJS)      │            │   (NestJS)      │
│                 │             │                 │            │                 │
└─────────────────┘             └─────────────────┘            └─────────────────┘
                                          │                              │
                                          │ gRPC                         │ Port: 5001
                                          ▼                              │
                                ┌─────────────────┐                     │
                                │                 │                     │
                                │ Product Service │◄────────────────────┘
                                │   (NestJS)      │
                                │                 │
                                └─────────────────┘
                                      Port: 5002
```

## Структура проекта

```
├── proto/                    # gRPC схемы
│   ├── user.proto           # Схема сервиса пользователей
│   └── product.proto        # Схема сервиса продуктов
├── frontend/                # NextJS приложение
├── api-gateway/            # HTTP REST API Gateway
├── user-service/           # Микросервис пользователей
└── product-service/        # Микросервис продуктов
```

## Быстрый старт

### 1. Установка зависимостей

```bash
pnpm install
```

### 2. Запуск микросервисов

Откройте 4 терминала и запустите каждый сервис:

**Терминал 1 - User Service (порт 5001):**
```bash
npx nx serve user-service
```

**Терминал 2 - Product Service (порт 5002):**
```bash
npx nx serve product-service
```

**Терминал 3 - API Gateway (порт 3333):**
```bash
npx nx serve api-gateway
```

**Терминал 4 - Frontend (порт 3000):**
```bash
npx nx dev frontend
```

### 3. Открытие приложения

Откройте браузер и перейдите по адресу: http://localhost:3000

## API Endpoints

### API Gateway (http://localhost:3333/api)

#### Пользователи
- `GET /users` - Получить список пользователей
- `GET /users/:id` - Получить пользователя по ID
- `POST /users` - Создать нового пользователя
- `PUT /users/:id` - Обновить пользователя
- `DELETE /users/:id` - Удалить пользователя

#### Продукты
- `GET /products` - Получить список продуктов
- `GET /products/:id` - Получить продукт по ID
- `POST /products` - Создать новый продукт
- `PUT /products/:id` - Обновить продукт
- `DELETE /products/:id` - Удалить продукт

## Примеры запросов

### Создание пользователя
```bash
curl -X POST http://localhost:3333/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван Иванов",
    "email": "ivan@example.com",
    "password": "password123"
  }'
```

### Создание продукта
```bash
curl -X POST http://localhost:3333/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Новый товар",
    "description": "Описание товара",
    "price": 99.99,
    "quantity": 10,
    "category": "Электроника"
  }'
```

## Технические детали

### gRPC Сервисы

Микросервисы общаются между собой через gRPC:
- **User Service**: `localhost:5001`
- **Product Service**: `localhost:5002`

### Proto файлы

Схемы gRPC определены в папке `proto/`:
- `user.proto` - определяет сервис и сообщения для пользователей
- `product.proto` - определяет сервис и сообщения для продуктов

### API Gateway

API Gateway служит единой точкой входа для фронтенда и:
- Принимает HTTP REST запросы
- Преобразует их в gRPC вызовы
- Возвращает ответы в JSON формате
- Обеспечивает CORS для фронтенда

## Команды разработки

### Сборка всех проектов
```bash
npx nx run-many -t build
```

### Запуск тестов
```bash
npx nx run-many -t test
```

### Линтинг
```bash
npx nx run-many -t lint
```

### Просмотр графа зависимостей
```bash
npx nx graph
```

## Расширение функциональности

### Добавление нового микросервиса

1. Создайте новый NestJS сервис:
```bash
npx nx g @nx/nest:app new-service
```

2. Создайте proto файл в папке `proto/`

3. Настройте gRPC в `main.ts` нового сервиса

4. Добавьте клиент в API Gateway

### Добавление новых endpoints

1. Обновите proto файл
2. Добавьте методы в сервис
3. Добавьте контроллер в API Gateway
4. Обновите фронтенд при необходимости

## Мониторинг и отладка

### Логи сервисов
Каждый сервис выводит логи в консоль. Для продакшена рекомендуется использовать централизованное логирование.

### Проверка состояния сервисов
- User Service: проверьте, что порт 5001 доступен
- Product Service: проверьте, что порт 5002 доступен
- API Gateway: http://localhost:3333/api
- Frontend: http://localhost:3000

## Производственное развертывание

Для развертывания в продакшене рекомендуется:

1. Использовать Docker контейнеры
2. Настроить service discovery (например, Consul)
3. Добавить load balancer
4. Настроить мониторинг (Prometheus + Grafana)
5. Добавить трейсинг (Jaeger)
6. Настроить CI/CD pipeline

## Лицензия

MIT
