import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    // Create user (UsersService handles hashing and duplicate check)
    const user = await this.usersService.create(email, password, name);

    // Generate JWT token immediately after registration
    const token = this.generateToken(user.id, user.email);

    return {
      user: { id: user.id, email: user.email, name: user.name },
      access_token: token,
    };
  }

  async login(email: string, password: string) {
    // Find user by email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare plain password with hashed password in DB
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.email);

    return {
      user: { id: user.id, email: user.email, name: user.name },
      access_token: token,
    };
  }

  private generateToken(userId: string, email: string) {
    return this.jwtService.sign({
      sub: userId, // 'sub' is JWT standard for subject (user id)
      email,
    });
  }
}