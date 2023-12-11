import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Image, Profile, Role, User } from 'src/shared/models';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(
        process.env.DB_PORT,
        parseInt(process.env.BCRYPT_SALT_ROUNDS),
      ),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      models: [Profile, User, Role, Image],
      logging: false,
    }),
  ],
})
export class DatabaseModule {}
