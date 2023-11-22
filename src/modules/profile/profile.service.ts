import { Injectable, NotFoundException } from '@nestjs/common';
import { ImageRepository, ProfileRepository } from 'src/shared/respositories';
import { UpdateUserDto } from '../users/dto';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly imageRepository: ImageRepository,
  ) {}

  async createProfile(userId: string): Promise<void> {
    await this.profileRepository.create({
      userId,
    });
  }

  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
    avatar: Express.Multer.File,
  ): Promise<void> {
    const profile = await this.profileRepository.findOne(userId);

    if (!profile) {
      throw new NotFoundException(
        `Profile not found for user with ID ${userId}`,
      );
    }

    await this.profileRepository.update(profile.id, updateUserDto);

    if (avatar) {
      const imagePath = path.join(
        process.cwd(),
        'src',
        'uploads',
        avatar.originalname,
      );
      console.log('Image path', imagePath);

      const image = await this.imageRepository.create({
        url: imagePath,
        profileId: profile.id,
      });

      console.log('Image record created:', image);

      try {
        await fs.promises.writeFile(imagePath, avatar.buffer);
        console.log('File saved successfully.');
      } catch (error) {
        console.error('Error saving file:', error);
        throw error;
      }

      await this.profileRepository.update(profile.id, { avatarId: image.id });
    }
  }

  async removeProfile(userId: string): Promise<void> {
    const profile = await this.profileRepository.findOne(userId);

    if (!profile) {
      throw new NotFoundException(
        `Profile not found for user with ID ${userId}`,
      );
    }

    if (profile.avatarId) {
      const avatar = await this.imageRepository.findOne(profile.avatarId);

      if (avatar) {
        try {
          await unlinkAsync(avatar.url);
        } catch (error) {
          throw error;
        }
      }
    }
  }
}
