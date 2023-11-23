import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileRepository } from 'src/shared/respositories';
import { UpdateUserDto } from '../users/dto';
import { ImageService } from '../image/image.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly imageService: ImageService,
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
      const image = await this.imageService.createImage(profile.id, avatar);
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
      await this.imageService.removeImage(profile.avatarId);
    }
  }
}
