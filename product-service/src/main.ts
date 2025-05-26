/**
 * Product Service - gRPC Microservice
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'product',
        protoPath: join(process.cwd(), 'proto/product.proto'),
        url: '0.0.0.0:5002',
      },
    }
  );

  await app.listen();
  Logger.log('🚀 Product Service is running on: 0.0.0.0:5002');
}

bootstrap();
