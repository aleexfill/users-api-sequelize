import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Profile, Role, User } from 'src/shared/models';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  ProfileRepository,
  RoleRepository,
  UserRepository,
} from 'src/shared/respositories';

@Module({
  imports: [SequelizeModule.forFeature([User, Role, Profile])],
  controllers: [UserController],
  providers: [UserService, UserRepository, RoleRepository, ProfileRepository],
  exports: [UserService, SequelizeModule],
})
export class UserModule {}
