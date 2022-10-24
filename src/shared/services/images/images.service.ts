import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { unlink } from 'fs/promises';
import { join } from 'path';
import * as sharp from 'sharp';

@Injectable()
export class ImagesService {
  private readonly serveStaticPath: string[] = this.config.getOrThrow<string>('SERVE_STATIC_PATH').split('/');
  private readonly folderName = 'images';

  constructor(private readonly config: ConfigService) {}

  async generateImagePath(file: Express.Multer.File): Promise<string> {
    const imageName = this.generateImageName();

    await sharp(file.buffer)
      .jpeg({ quality: 90 })
      .toFormat('jpeg')
      .toFile(join(...this.serveStaticPath, this.folderName, imageName));

    return `${this.folderName}/${imageName}`;
  }

  async deleteImage(imagePath: string): Promise<void> {
    return unlink(join(...this.serveStaticPath, imagePath));
  }

  private generateImageName(): string {
    return `${new Date().toISOString().replace(/[:]|[.]/g, '-')}-${Date.now().toString(36)}.jpeg`;
  }
}
