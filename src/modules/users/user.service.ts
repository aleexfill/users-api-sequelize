import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/shared/models';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserRole } from 'src/shared/enums';
import {
  ProfileRepository,
  RoleRepository,
  UserRepository,
} from 'src/shared/respositories';

@Injectable()
export class UserService {
  private readonly bcryptSaltRounds: number = parseInt(
    process.env.BCRYPT_SALT_ROUNDS,
  );

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly profileRepository: ProfileRepository,
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

    const profile = await this.profileRepository.create({
      userId: user.id,
    });

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.update(id, updateUserDto);

    const profile = await this.profileRepository.findOne(id);

    if (!profile) {
      throw new NotFoundException(`Profile not found for user with ID ${id}`);
    }

    await this.profileRepository.update(profile.id, updateUserDto);

    return this.userRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.remove(id);
  }
}
