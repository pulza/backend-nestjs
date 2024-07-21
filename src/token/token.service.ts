import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class TokenService {
  private readonly secretKey: string;

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get('TOKEN_SECRET', 'secret');
  }

  generateToken(userId: number): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const payload = Buffer.from(JSON.stringify({ userId, exp: Math.floor(Date.now() / 1000) + 3600 })).toString(
      'base64',
    );
    const signature = crypto.createHmac('sha256', this.secretKey).update(`${header}.${payload}`).digest('base64');
    const token = `${header}.${payload}.${signature}`;

    return token;
  }

  validateToken(token: string): boolean {
    const [header, payload, signature] = token.split('.');

    const validSignature = crypto.createHmac('sha256', this.secretKey).update(`${header}.${payload}`).digest('base64');

    return signature === validSignature;
  }

  decodeToken(token: string): any {
    const payload = token.split('.')[1];
    const decodeToken = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));

    return decodeToken;
  }
}
