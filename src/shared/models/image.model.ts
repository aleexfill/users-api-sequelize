import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  IsUUID,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Profile } from './profile.model';

@Table
export class Image extends Model<Image> {
  @IsUUID(4)
  @PrimaryKey
  @Default(uuidv4)
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.STRING)
  url: string;

  @ForeignKey(() => Profile)
  @Column(DataType.UUID)
  profileId: string;

  @BelongsTo(() => Profile)
  profile: Profile;
}
