import { RefreshToken } from '@prisma/client';
import { IsDateString, IsString } from 'class-validator';

export class RefreshTokenEntity implements RefreshToken {
  @IsString()
  id: string;
  @IsString()
  value: string;

  // DateTime
  @IsDateString()
  createdAt: Date;
  @IsDateString()
  updatedAt: Date;

  // User
  @IsString()
  userId: string;
}
