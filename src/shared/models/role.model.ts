import {
  Column,
  DataType,
  Default,
  HasMany,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from '../enums';
import { User } from './user.model';

@Table
export class Role extends Model<Role> {
  @IsUUID(4)
  @PrimaryKey
  @Default(uuidv4)
  @Column(DataType.UUID)
  roleId: string;

  @Column(DataType.ENUM(...Object.values(UserRole)))
  role: UserRole;

  @HasMany(() => User)
  users: User[];
}
