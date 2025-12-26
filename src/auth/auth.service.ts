import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-users.dto';
import * as bcrypt from 'bcrypt';

import { LoginUserDto } from '../users/dto/login-users.dto';
import { isNil } from 'lodash';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async register(dto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (!isNil(existingUser)) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.usersService.create(dto);
    delete user.password;
    return user;
  }

  async login(dto: LoginUserDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (isNil(user)) throw new BadRequestException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (isNil(isPasswordValid))
      throw new BadRequestException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: { id: user.id, email: user.email, role: payload.role },
    };
  }
}
