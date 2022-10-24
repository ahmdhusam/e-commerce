import { FileTypeValidator, Injectable, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';
import { ImagesService } from '../services';

interface Fields {
  [key: string]: Express.Multer.File[];
}

interface FieldPaths {
  [key: string]: string[];
}

@Injectable()
export class SharpPipe extends ParseFilePipe {
  constructor(private readonly imagesService: ImagesService) {
    super({
      validators: [
        new FileTypeValidator({ fileType: 'image' }),
        new MaxFileSizeValidator({ maxSize: 1048576 /* 1MB */ }),
      ],
    });
  }

  async transform(fields: Fields): Promise<FieldPaths> {
    const fieldPaths: FieldPaths = {};

    for (const fieldName in fields) {
      await this.validateFiles(fields[fieldName]);
    }

    for (const fieldName in fields) {
      fieldPaths[fieldName] = await Promise.all(
        fields[fieldName].map(file => this.imagesService.generateImagePath(file)),
      );
    }

    return fieldPaths;
  }

  private async validateFiles(files: Express.Multer.File[]): Promise<void> {
    if (!this.getValidators().length) return;

    await Promise.all(files.map(file => this.validate(file)));
  }
}
