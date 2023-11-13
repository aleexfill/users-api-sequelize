import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { User } from 'src/shared/models';
import { CreateUserDto } from '../users/dto';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

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
    if (user && (await bcrypt.compare(userDto.password, user.password))) {
      const payload = { sub: user.id };
      return {
        accessToken: this.jwtService.sign(payload),
      };
    }

    return null;
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    if (!userId) {
      throw new BadRequestException('User ID is missing');
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      this.bcryptSaltRounds,
    );
    await this.userService.update(userId, { password: hashedPassword });
  }
}
