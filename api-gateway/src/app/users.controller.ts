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

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserDto {
  email: string;
  name: string;
  password: string;
}

interface UpdateUserDto {
  email: string;
  name: string;
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

interface UserService {
  createUser(data: CreateUserDto): Observable<UserResponse>;
  getUser(data: { id: string }): Observable<UserResponse>;
  updateUser(data: { id: string } & UpdateUserDto): Observable<UserResponse>;
  deleteUser(data: { id: string }): Observable<DeleteUserResponse>;
  getUsers(data: { page: number; limit: number }): Observable<GetUsersResponse>;
}

@Controller('users')
export class UsersController {
  private userService: UserService;

  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Observable<UserResponse> {
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  getUser(@Param('id') id: string): Observable<UserResponse> {
    return this.userService.getUser({ id });
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Observable<UserResponse> {
    return this.userService.updateUser({ id, ...updateUserDto });
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Observable<DeleteUserResponse> {
    return this.userService.deleteUser({ id });
  }

  @Get()
  getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Observable<GetUsersResponse> {
    return this.userService.getUsers({ page: Number(page), limit: Number(limit) });
  }
} 