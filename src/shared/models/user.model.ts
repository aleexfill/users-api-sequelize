import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  IsUUID,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

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
}
