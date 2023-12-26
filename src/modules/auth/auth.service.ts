import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { User } from 'src/shared/models';
import { CreateUserDto } from '../users/dto';
import * as bcrypt from 'bcryptjs';
import { SocketService } from '../socket/socket.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  private readonly bcryptSaltRounds: number = parseInt(
    process.env.BCRYPT_SALT_ROUNDS,
  );

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly socketService: SocketService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  async login(userDto: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string }> {
    const cachedUser = await this.cacheManager.get<User>(
      `user_email_${userDto.email}`,
    );

    let user: User;

    if (cachedUser) {
      user = cachedUser;
    } else {
      user = await this.userService.findOneByEmail(userDto.email);

      if (!user) {
        throw new NotFoundException(
          `User with email ${userDto.email} not found`,
        );
      }

      await this.cacheManager.set(`user_email_${userDto.email}`, user, 60);
    }

    if (!(await bcrypt.compare(userDto.password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    await this.userService.update(user.id, { online: true }, null);

    this.socketService.emitEvent('user-online', { userId: user.id });

    const payload = { sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    await this.cacheManager.del(`user_${userId}`);
    await this.cacheManager.del('all_users');

    if (!userId) {
      throw new BadRequestException('User ID is missing');
    }

    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new BadRequestException('Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      this.bcryptSaltRounds,
    );

    await this.userService.update(userId, { password: hashedPassword }, null);
  }
}
