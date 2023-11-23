import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ImageService } from './image.service';
import { ImageRepository } from 'src/shared/respositories';
import { Image } from 'src/shared/models';

@Module({
  imports: [SequelizeModule.forFeature([Image])],
  providers: [ImageService, ImageRepository],
  exports: [ImageService, SequelizeModule],
})
export class ImageModule {}
