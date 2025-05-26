import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Inject,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

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

interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
}

interface UpdateProductDto {
  name: string;
  description: string;
  price: number;
  quantity: number;
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

interface ProductService {
  createProduct(data: CreateProductDto): Observable<ProductResponse>;
  getProduct(data: { id: string }): Observable<ProductResponse>;
  updateProduct(data: { id: string } & UpdateProductDto): Observable<ProductResponse>;
  deleteProduct(data: { id: string }): Observable<DeleteProductResponse>;
  getProducts(data: { page: number; limit: number; category: string }): Observable<GetProductsResponse>;
}

@Controller('products')
export class ProductsController {
  private productService: ProductService;

  constructor(@Inject('PRODUCT_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.productService = this.client.getService<ProductService>('ProductService');
  }

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto): Observable<ProductResponse> {
    return this.productService.createProduct(createProductDto);
  }

  @Get(':id')
  getProduct(@Param('id') id: string): Observable<ProductResponse> {
    return this.productService.getProduct({ id });
  }

  @Put(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ): Observable<ProductResponse> {
    return this.productService.updateProduct({ id, ...updateProductDto });
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string): Observable<DeleteProductResponse> {
    return this.productService.deleteProduct({ id });
  }

  @Get()
  getProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('category') category: string = ''
  ): Observable<GetProductsResponse> {
    return this.productService.getProducts({ 
      page: Number(page), 
      limit: Number(limit),
      category: category || ''
    });
  }
} 