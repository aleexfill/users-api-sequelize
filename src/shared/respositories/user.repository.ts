import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models';
import { CreateUserDto, UpdateUserDto } from 'src/modules/users/dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel.create(createUserDto);
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
