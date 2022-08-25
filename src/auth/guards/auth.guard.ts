import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const UseAuthGuard = () => UseGuards(JwtAuthGuard);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
