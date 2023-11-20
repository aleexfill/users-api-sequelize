import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '../models';
import { UserRole } from '../enums';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectModel(Role)
    private readonly roleModel: typeof Role,
  ) {}

  async findOneByRole(role: UserRole): Promise<Role> {
    return this.roleModel.findOne({ where: { role } });
  }
}
