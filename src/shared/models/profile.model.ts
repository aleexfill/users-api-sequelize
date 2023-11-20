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
import { User } from './user.model';
import { Gender } from '../enums';

@Table
export class Profile extends Model<Profile> {
  @IsUUID(4)
  @PrimaryKey
  @Default(uuidv4)
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.STRING)
  phone: string;

  @Column(DataType.STRING)
  country: string;

  @Column(DataType.STRING)
  city: string;

  @Column(DataType.TEXT)
  aboutMyself: string;

  @Column(DataType.ENUM(...Object.values(Gender)))
  gender: Gender;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  updatedAt: Date;
}
