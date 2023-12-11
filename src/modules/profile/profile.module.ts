import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Image, Profile } from 'src/shared/models';
import { ProfileService } from './profile.service';
import { ProfileRepository } from 'src/shared/respositories';
import { ImageModule } from '../image/image.module';

const providers = [ProfileService, ProfileRepository];

@Module({
  imports: [SequelizeModule.forFeature([Profile, Image]), ImageModule],
  providers: [...providers],
  exports: [ProfileService, SequelizeModule],
})
export class ProfileModule {}
