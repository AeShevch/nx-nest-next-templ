import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface OrderService {
  createOrder(data: { user_id: string; items: OrderItem[] }): Observable<{ order: Order }>;
  getOrder(data: { id: string }): Observable<{ order: Order }>;
  updateOrder(data: { id: string; status: string }): Observable<{ order: Order }>;
  deleteOrder(data: { id: string }): Observable<{ success: boolean; message: string }>;
  getOrders(data: { page: number; limit: number; user_id?: string }): Observable<{ orders: Order[]; total: number; page: number; limit: number }>;
}

@Controller('orders')
export class OrdersController {
  private orderService: OrderService;

  constructor(@Inject('ORDER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.orderService = this.client.getService<OrderService>('OrderService');
  }

  @Post()
  createOrder(@Body() createOrderDto: { user_id: string; items: OrderItem[] }) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.orderService.getOrder({ id });
  }

  @Put(':id')
  updateOrder(@Param('id') id: string, @Body() updateOrderDto: { status: string }) {
    return this.orderService.updateOrder({ id, status: updateOrderDto.status });
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder({ id });
  }

  @Get()
  getOrders(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('user_id') user_id?: string
  ) {
    return this.orderService.getOrders({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      user_id,
    });
  }
} 