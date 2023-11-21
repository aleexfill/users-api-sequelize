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
  ImageRepository,
  ProfileRepository,
  RoleRepository,
  UserRepository,
} from 'src/shared/respositories';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UserService {
  private readonly bcryptSaltRounds: number = parseInt(
    process.env.BCRYPT_SALT_ROUNDS,
  );

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly imageRepository: ImageRepository,
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

    const profile = await this.profileRepository.findOne(id);

    if (!profile) {
      throw new NotFoundException(`Profile not found for user with ID ${id}`);
    }

    await this.profileRepository.update(profile.id, updateUserDto);

    if (avatar) {
      const imagePath = path.join(
        process.cwd(),
        'src',
        'uploads',
        avatar.originalname,
      );
      console.log('Image path', imagePath);

      const image = await this.imageRepository.create({
        url: imagePath,
        profileId: profile.id,
      });

      console.log('Image record created:', image);

      try {
        await fs.promises.writeFile(imagePath, avatar.buffer);
        console.log('File saved successfully.');
      } catch (error) {
        console.error('Error saving file:', error);
        throw error;
      }

      await this.profileRepository.update(profile.id, { avatarId: image.id });
    }

    return this.userRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const profile = await this.profileRepository.findOne(user.id);

    if (!profile) {
      throw new NotFoundException(`Profile not found for user with ID ${id}`);
    }

    await this.profileRepository.remove({ where: { userId: user.id } });

    await this.userRepository.remove(id);
  }
}
