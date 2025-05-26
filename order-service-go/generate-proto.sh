#!/bin/bash

# Скрипт для генерации Go кода из proto файлов

echo "🔧 Генерация Go кода из proto файлов..."

# Проверяем наличие protoc
if ! command -v protoc &> /dev/null; then
    echo "❌ protoc не установлен. Установите Protocol Buffers compiler:"
    echo "   brew install protobuf"
    exit 1
fi

# Проверяем наличие protoc-gen-go
if ! command -v protoc-gen-go &> /dev/null; then
    echo "📦 Устанавливаем protoc-gen-go..."
    go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
fi

# Проверяем наличие protoc-gen-go-grpc
if ! command -v protoc-gen-go-grpc &> /dev/null; then
    echo "📦 Устанавливаем protoc-gen-go-grpc..."
    go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
fi

# Создаем директорию для сгенерированных файлов
mkdir -p proto

# Генерируем Go код
protoc --proto_path=../proto --go_out=. --go_opt=paths=source_relative \
       --go-grpc_out=. --go-grpc_opt=paths=source_relative \
       order.proto

echo "✅ Go код успешно сгенерирован в директории proto/"