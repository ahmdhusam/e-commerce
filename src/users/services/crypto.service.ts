import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  hash(data: string, salt: number): Promise<string> {
    return bcrypt.hash(data, salt);
  }

  compare(data: string, encryptedData: string): Promise<boolean> {
    return bcrypt.compare(data, encryptedData);
  }
}
