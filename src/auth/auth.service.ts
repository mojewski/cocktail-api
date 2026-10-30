import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.findByEmail(registerDto.email);

    if (user) {
      throw new ConflictException('This email is already in use');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = await this.usersService.createUser({ ...registerDto, password: hashedPassword})

    const payload = { sub: newUser.id, email: newUser.email, role: newUser.role };

    return { access_token: await this.jwtService.signAsync(payload) }
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const payload = { sub: user.id, email: user.email, role: user.role, };

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
