import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Image } from '../models';

@Injectable()
export class ImageRepository {
  constructor(
    @InjectModel(Image)
    private readonly imageModel: typeof Image,
  ) {}

  async create(data: Partial<Image>): Promise<Image> {
    return this.imageModel.create(data);
  }

  async findOne(id: string): Promise<Image> {
    return this.imageModel.findByPk(id);
  }

  async update(id: string, profileData: any): Promise<Image> {
    await this.imageModel.update(profileData, { where: { id } });
    return this.imageModel.findByPk(id);
  }

  async remove(id: string): Promise<void> {
    await this.imageModel.destroy({ where: { id } });
  }
}
