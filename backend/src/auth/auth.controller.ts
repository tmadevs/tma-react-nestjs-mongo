import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { extractedFirstStartParam, InitData } from './auth.utils';

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

    if (initData.start_param) {
      const start_param = extractedFirstStartParam(initData.start_param);

      try {
        switch (start_param) {
          default:
            await this.usersService.addReferral(start_param, user._id);
            break;
        }
      } catch (error) {
        console.error(error);
      }
    }

    const accessToken = this.authService.createAccessToken(user.id, user._id);

    return {
      accessToken,
      user,
    };
  }
}
