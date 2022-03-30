import { Body, Controller, Post } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';

import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async signupUser(@Body() userData: { name: string; email: string }): Promise<UserModel> {
    return this.userService.createUser(userData);
  }
}
