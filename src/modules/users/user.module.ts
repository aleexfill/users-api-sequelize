import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Image, Profile, Role, User } from 'src/shared/models';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  ImageRepository,
  ProfileRepository,
  RoleRepository,
  UserRepository,
} from 'src/shared/respositories';

@Module({
  imports: [SequelizeModule.forFeature([User, Role, Profile, Image])],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    RoleRepository,
    ProfileRepository,
    ImageRepository,
  ],
  exports: [UserService, SequelizeModule],
})
export class UserModule {}
