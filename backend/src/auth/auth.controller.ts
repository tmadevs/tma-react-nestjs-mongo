import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { InitData } from './auth.utils';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('sync')
  async sync(@Body() body) {
    let initData: InitData;
    try {
      initData = this.authService.validateMiniAppInitData(body.initDataRaw);
    } catch (error) {
      console.error(error);
      throw new Error('Invalid init data');
    }

    const user = await this.usersService.findOrCreateTelegramUser(initData);
    const accessToken = this.authService.createAccessToken(user.id, user._id);

    return {
      accessToken,
      user,
    };
  }
}
