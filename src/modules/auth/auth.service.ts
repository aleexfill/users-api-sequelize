import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { User } from 'src/shared/models';
import { CreateUserDto } from '../users/dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly bcryptSaltRounds: number = parseInt(
    process.env.BCRYPT_SALT_ROUNDS,
  );

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  async login(userDto: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string }> {
    const user = await this.userService.findOneByEmail(userDto.email);
    if (!user) {
      throw new NotFoundException(`User with email ${userDto.email} not found`);
    }

    if (!(await bcrypt.compare(userDto.password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    if (!userId) {
      throw new BadRequestException('User ID is missing');
    }

    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      this.bcryptSaltRounds,
    );
    await this.userService.update(userId, { password: hashedPassword }, null);
  }
}
