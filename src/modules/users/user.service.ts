import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/shared/models';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserRole } from 'src/shared/enums/user';
import { RoleRepository, UserRepository } from 'src/shared/respositories';

@Injectable()
export class UserService {
  private readonly bcryptSaltRounds: number = parseInt(
    process.env.BCRYPT_SALT_ROUNDS,
  );

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
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

    createUserDto.roleId = role.roleId;

    return this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
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

    return this.userRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.remove(id);
  }
}
