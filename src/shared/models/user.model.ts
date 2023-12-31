import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  IsUUID,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Role } from './role.model';
import { Profile } from './profile.model';

@Table
export class User extends Model<User> {
  @IsUUID(4)
  @PrimaryKey
  @Default(uuidv4)
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.STRING)
  firstName: string;

  @Column(DataType.STRING)
  lastName: string;

  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  password: string;

  @ForeignKey(() => Role)
  @Column(DataType.UUID)
  roleId: string;

  @BelongsTo(() => Role)
  role: Role;

  @ForeignKey(() => Profile)
  @Column(DataType.UUID)
  profileId: string;

  @BelongsTo(() => Profile)
  profile: Profile;

  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  updatedAt: Date;
}
