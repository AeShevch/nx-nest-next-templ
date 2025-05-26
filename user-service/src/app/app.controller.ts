import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';

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

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('UserService', 'CreateUser')
  createUser(data: CreateUserRequest): UserResponse {
    return this.appService.createUser(data);
  }

  @GrpcMethod('UserService', 'GetUser')
  getUser(data: GetUserRequest): UserResponse {
    return this.appService.getUser(data);
  }

  @GrpcMethod('UserService', 'UpdateUser')
  updateUser(data: UpdateUserRequest): UserResponse {
    return this.appService.updateUser(data);
  }

  @GrpcMethod('UserService', 'DeleteUser')
  deleteUser(data: DeleteUserRequest): DeleteUserResponse {
    return this.appService.deleteUser(data);
  }

  @GrpcMethod('UserService', 'GetUsers')
  getUsers(data: GetUsersRequest): GetUsersResponse {
    return this.appService.getUsers(data);
  }
}
