import { Injectable } from '@nestjs/common';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
}

interface GetUserRequest {
  id: string;
}

interface UpdateUserRequest {
  id: string;
  email: string;
  name: string;
}

interface DeleteUserRequest {
  id: string;
}

interface GetUsersRequest {
  page: number;
  limit: number;
}

interface UserResponse {
  user: User;
  success: boolean;
  message: string;
}

interface DeleteUserResponse {
  success: boolean;
  message: string;
}

interface GetUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class AppService {
  private users: User[] = [
    {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'jane@example.com',
      name: 'Jane Smith',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  createUser(data: CreateUserRequest): UserResponse {
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      email: data.email,
      name: data.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.push(newUser);

    return {
      user: newUser,
      success: true,
      message: 'User created successfully',
    };
  }

  getUser(data: GetUserRequest): UserResponse {
    const user = this.users.find((u) => u.id === data.id);

    if (!user) {
      return {
        user: null,
        success: false,
        message: 'User not found',
      };
    }

    return {
      user,
      success: true,
      message: 'User retrieved successfully',
    };
  }

  updateUser(data: UpdateUserRequest): UserResponse {
    const userIndex = this.users.findIndex((u) => u.id === data.id);

    if (userIndex === -1) {
      return {
        user: null,
        success: false,
        message: 'User not found',
      };
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      email: data.email,
      name: data.name,
      updatedAt: new Date().toISOString(),
    };

    return {
      user: this.users[userIndex],
      success: true,
      message: 'User updated successfully',
    };
  }

  deleteUser(data: DeleteUserRequest): DeleteUserResponse {
    const userIndex = this.users.findIndex((u) => u.id === data.id);

    if (userIndex === -1) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    this.users.splice(userIndex, 1);

    return {
      success: true,
      message: 'User deleted successfully',
    };
  }

  getUsers(data: GetUsersRequest): GetUsersResponse {
    const page = data.page || 1;
    const limit = data.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedUsers = this.users.slice(startIndex, endIndex);

    return {
      users: paginatedUsers,
      total: this.users.length,
      page,
      limit,
    };
  }
}
