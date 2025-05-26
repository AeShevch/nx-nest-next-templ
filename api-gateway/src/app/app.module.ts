import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users.controller';
import { ProductsController } from './products.controller';
import { OrdersController } from './orders.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(process.cwd(), 'proto/user.proto'),
          url: '0.0.0.0:5001',
        },
      },
      {
        name: 'PRODUCT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'product',
          protoPath: join(process.cwd(), 'proto/product.proto'),
          url: '0.0.0.0:5002',
        },
      },
      {
        name: 'ORDER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'order',
          protoPath: join(process.cwd(), 'proto/order.proto'),
          url: '0.0.0.0:5003',
        },
      },
    ]),
  ],
  controllers: [AppController, UsersController, ProductsController, OrdersController],
  providers: [AppService],
})
export class AppModule {}
