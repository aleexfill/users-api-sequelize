import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Image, Profile, Role, User } from 'src/shared/models';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleRepository, UserRepository } from 'src/shared/respositories';
import { ProfileModule } from '../profile/profile.module';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role, Profile, Image]),
    ProfileModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, RoleRepository],
  exports: [UserService, SequelizeModule],
})
export class UserModule {}
