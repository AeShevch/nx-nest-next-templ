import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
}

interface GetProductRequest {
  id: string;
}

interface UpdateProductRequest {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
}

interface DeleteProductRequest {
  id: string;
}

interface GetProductsRequest {
  page: number;
  limit: number;
  category: string;
}

interface ProductResponse {
  product: Product;
  success: boolean;
  message: string;
}

interface DeleteProductResponse {
  success: boolean;
  message: string;
}

interface GetProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('ProductService', 'CreateProduct')
  createProduct(data: CreateProductRequest): ProductResponse {
    return this.appService.createProduct(data);
  }

  @GrpcMethod('ProductService', 'GetProduct')
  getProduct(data: GetProductRequest): ProductResponse {
    return this.appService.getProduct(data);
  }

  @GrpcMethod('ProductService', 'UpdateProduct')
  updateProduct(data: UpdateProductRequest): ProductResponse {
    return this.appService.updateProduct(data);
  }

  @GrpcMethod('ProductService', 'DeleteProduct')
  deleteProduct(data: DeleteProductRequest): DeleteProductResponse {
    return this.appService.deleteProduct(data);
  }

  @GrpcMethod('ProductService', 'GetProducts')
  getProducts(data: GetProductsRequest): GetProductsResponse {
    return this.appService.getProducts(data);
  }
}
