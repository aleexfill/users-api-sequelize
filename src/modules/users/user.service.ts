import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/shared/models';
import { CreateUserDto, UpdateUserDto } from './dto/request';
import { UserRole } from 'src/shared/enums';
import { RoleRepository, UserRepository } from 'src/shared/respositories';
import { ProfileService } from '../profile/profile.service';
import * as bcrypt from 'bcryptjs';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UserService {
  private readonly bcryptSaltRounds: number = parseInt(
    process.env.BCRYPT_SALT_ROUNDS,
  );

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly profileService: ProfileService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email is already taken');
    }

    const role = await this.roleRepository.findOneByRole(UserRole.USER);

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.bcryptSaltRounds,
    );

    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      roleId: role.roleId,
    });

    const profile = await this.profileService.createProfile(user.id);
    user.profileId = profile.id;
    await user.save();

    await this.cacheManager.del('all_users');

    return user;
  }

  async findAll(): Promise<User[]> {
    const cachedUsers = await this.cacheManager.get<User[]>('all_users');

    if (cachedUsers) {
      return cachedUsers;
    }

    const users = this.userRepository.findAll();

    await this.cacheManager.set('all_users', users, 60);

    return users;
  }

  async findOne(id: string): Promise<User> {
    const cachedUser = await this.cacheManager.get<User>(`user_${id}`);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.cacheManager.set(`user_${id}`, user, 60);

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    avatar: Express.Multer.File,
  ): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.update(id, updateUserDto);

    await this.profileService.updateProfile(id, updateUserDto, avatar);

    await this.cacheManager.del(`user_${id}`);
    await this.cacheManager.del('all_users');

    return this.userRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.profileService.removeProfile(id);

    await this.userRepository.remove(id);
  }
}
