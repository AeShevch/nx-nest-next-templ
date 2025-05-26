/**
 * User Service - gRPC Microservice
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
        package: 'user',
        protoPath: join(process.cwd(), 'proto/user.proto'),
        url: '0.0.0.0:5001',
      },
    }
  );

  await app.listen();
  Logger.log('🚀 User Service is running on: 0.0.0.0:5001');
}

bootstrap();
