import { Injectable } from '@nestjs/common';

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

@Injectable()
export class AppService {
  private products: Product[] = [
    {
      id: '1',
      name: 'Laptop',
      description: 'High-performance laptop',
      price: 999.99,
      quantity: 10,
      category: 'Electronics',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Smartphone',
      description: 'Latest smartphone model',
      price: 699.99,
      quantity: 25,
      category: 'Electronics',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Coffee Mug',
      description: 'Ceramic coffee mug',
      price: 12.99,
      quantity: 50,
      category: 'Home',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  createProduct(data: CreateProductRequest): ProductResponse {
    const newProduct: Product = {
      id: (this.products.length + 1).toString(),
      name: data.name,
      description: data.description,
      price: data.price,
      quantity: data.quantity,
      category: data.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.products.push(newProduct);

    return {
      product: newProduct,
      success: true,
      message: 'Product created successfully',
    };
  }

  getProduct(data: GetProductRequest): ProductResponse {
    const product = this.products.find((p) => p.id === data.id);

    if (!product) {
      return {
        product: null,
        success: false,
        message: 'Product not found',
      };
    }

    return {
      product,
      success: true,
      message: 'Product retrieved successfully',
    };
  }

  updateProduct(data: UpdateProductRequest): ProductResponse {
    const productIndex = this.products.findIndex((p) => p.id === data.id);

    if (productIndex === -1) {
      return {
        product: null,
        success: false,
        message: 'Product not found',
      };
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      name: data.name,
      description: data.description,
      price: data.price,
      quantity: data.quantity,
      category: data.category,
      updatedAt: new Date().toISOString(),
    };

    return {
      product: this.products[productIndex],
      success: true,
      message: 'Product updated successfully',
    };
  }

  deleteProduct(data: DeleteProductRequest): DeleteProductResponse {
    const productIndex = this.products.findIndex((p) => p.id === data.id);

    if (productIndex === -1) {
      return {
        success: false,
        message: 'Product not found',
      };
    }

    this.products.splice(productIndex, 1);

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }

  getProducts(data: GetProductsRequest): GetProductsResponse {
    let filteredProducts = this.products;

    // Filter by category if provided
    if (data.category && data.category.trim() !== '') {
      filteredProducts = this.products.filter(
        (p) => p.category.toLowerCase() === data.category.toLowerCase()
      );
    }

    const page = data.page || 1;
    const limit = data.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      total: filteredProducts.length,
      page,
      limit,
    };
  }
}
