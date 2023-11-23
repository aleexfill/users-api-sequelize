import { Injectable, NotFoundException } from '@nestjs/common';
import { ImageRepository } from 'src/shared/respositories';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class ImageService {
  constructor(private readonly imageRepository: ImageRepository) {}

  async createImage(profileId: string, avatar: Express.Multer.File) {
    const imagePath = path.join(
      process.cwd(),
      'src',
      'uploads',
      avatar.originalname,
    );

    const image = await this.imageRepository.create({
      url: imagePath,
      profileId: profileId,
    });

    try {
      await fs.promises.writeFile(imagePath, avatar.buffer);
    } catch (error) {
      throw error;
    }
    return image;
  }

  async removeImage(imageId: string): Promise<void> {
    const image = await this.imageRepository.findOne(imageId);

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    try {
      await unlinkAsync(image.url);
    } catch (error) {
      throw error;
    }
  }
}
