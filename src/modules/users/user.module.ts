import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Image, Profile, Role, User } from 'src/shared/models';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleRepository, UserRepository } from 'src/shared/respositories';
import { ProfileModule } from '../profile/profile.module';

const providers = [UserService, UserRepository, RoleRepository];

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role, Profile, Image]),
    ProfileModule,
  ],
  controllers: [UserController],
  providers: [...providers],
  exports: [UserService, SequelizeModule],
})
export class UserModule {}
