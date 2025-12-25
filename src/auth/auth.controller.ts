import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-users.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-users.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }
}
