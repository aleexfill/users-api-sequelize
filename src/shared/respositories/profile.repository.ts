import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from '../models';

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectModel(Profile)
    private readonly profileModel: typeof Profile,
  ) {}

  async create(profileData: any): Promise<Profile> {
    return this.profileModel.create(profileData);
  }

  async update(id: string, profileData: any): Promise<Profile> {
    await this.profileModel.update(profileData, { where: { id } });
    return this.profileModel.findByPk(id);
  }

  async findOne(userId: string): Promise<Profile> {
    return this.profileModel.findOne({ where: { userId } });
  }
}
