import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role, User } from 'src/shared/models';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleRepository, UserRepository } from 'src/shared/respositories';

@Module({
  imports: [SequelizeModule.forFeature([User, Role])],
  controllers: [UserController],
  providers: [UserService, UserRepository, RoleRepository],
  exports: [UserService, SequelizeModule],
})
export class UserModule {}
