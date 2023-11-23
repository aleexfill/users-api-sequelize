import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Image, Profile } from 'src/shared/models';
import { ProfileService } from './profile.service';
import { ImageRepository, ProfileRepository } from 'src/shared/respositories';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [SequelizeModule.forFeature([Profile, Image]), ImageModule],
  providers: [ProfileService, ProfileRepository],
  exports: [ProfileService, SequelizeModule],
})
export class ProfileModule {}
