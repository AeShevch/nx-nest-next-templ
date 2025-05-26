'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

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

export default function Index() {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'orders'>('users');
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3333/api/users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3333/api/products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3333/api/orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span>🚀 Микросервисная архитектура </span>
              Nx + NestJS + NextJS + gRPC
            </h1>
            <p>Демонстрация работы микросервисов через gRPC</p>
          </div>

          <div className="tabs">
            <button 
              className={activeTab === 'users' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('users')}
            >
              👥 Пользователи
            </button>
            <button 
              className={activeTab === 'products' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('products')}
            >
              📦 Продукты
            </button>
            <button 
              className={activeTab === 'orders' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('orders')}
            >
              🛒 Заказы
            </button>
          </div>

          <div className="content">
            {loading ? (
              <div className="loading">Загрузка...</div>
            ) : (
              <>
                {activeTab === 'users' && (
                  <div className="users-section">
                    <h2>Список пользователей</h2>
                    <div className="grid">
                      {users.map((user) => (
                        <div key={user.id} className="card">
                          <h3>{user.name}</h3>
                          <p>Email: {user.email}</p>
                          <p>ID: {user.id}</p>
                          <small>Создан: {new Date(user.createdAt).toLocaleDateString()}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'products' && (
                  <div className="products-section">
                    <h2>Список продуктов</h2>
                    <div className="grid">
                      {products.map((product) => (
                        <div key={product.id} className="card">
                          <h3>{product.name}</h3>
                          <p>{product.description}</p>
                          <p>Цена: ${product.price}</p>
                          <p>Количество: {product.quantity}</p>
                          <p>Категория: {product.category}</p>
                          <small>Создан: {new Date(product.createdAt).toLocaleDateString()}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="orders-section">
                    <h2>Список заказов</h2>
                    <div className="grid">
                      {orders.map((order) => (
                        <div key={order.id} className="card order-card">
                          <h3>Заказ #{order.id}</h3>
                          <div className="order-info">
                            <p><strong>Пользователь:</strong> {order.user_id}</p>
                            <p><strong>Статус:</strong> 
                              <span className={`status ${order.status}`}> {order.status}</span>
                            </p>
                            <p><strong>Общая сумма:</strong> ${order.total_amount}</p>
                          </div>
                          <div className="order-items">
                            <h4>Товары:</h4>
                            {order.items.map((item, index) => (
                              <div key={index} className="order-item">
                                <span>{item.product_name}</span>
                                <span>x{item.quantity}</span>
                                <span>${item.price}</span>
                              </div>
                            ))}
                          </div>
                          <small>Создан: {new Date(order.created_at).toLocaleDateString()}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
