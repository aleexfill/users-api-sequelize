import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/shared/models';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class UserService {
  private readonly bcryptSaltRounds: number = parseInt(
    process.env.BCRYPT_SALT_ROUNDS,
  );

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email is already taken');
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.bcryptSaltRounds,
    );
    return this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findByPk(id);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userModel.update(updateUserDto, { where: { id } });
    return this.userModel.findByPk(id);
  }

  async remove(id: string): Promise<void> {
    await this.userModel.destroy({ where: { id } });
  }
}
