import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users/users.service';
import { JwtAuthGuard } from './auth/auth.guard';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { User } from './users/entities/user.entity';
import {
  CheckProofPayload,
  CheckTonProof,
  GenerateTonProofPayload,
} from './auth/dto/tonproof';
import { checkProof, generatePayload } from './auth/guards/ton-proof';
import { BotService } from './bot/bot.service';

@UseGuards(JwtAuthGuard)
@Controller('api')
export class AppController {
  constructor(
    private readonly usersService: UsersService,
    private readonly botService: BotService,
  ) {
    // this.botService.launch();
  }

  @Get('events')
  async getEvents(@CurrentUser() user: User) {
    return [];
  }

  @Post('generate-payload')
  generatePayload(): GenerateTonProofPayload {
    return generatePayload();
  }

  @Post('check-proof')
  async checkProof(
    @Body() checkProofPayload: CheckProofPayload,
  ): Promise<CheckTonProof> {
    return await checkProof(checkProofPayload);
  }

  @Post('mining/complete')
  async miningCompelete(@Body() body, @CurrentUser() user: User): Promise<any> {
    //daily streak for user
    // based on last_claim_daily_day, last_claim_daily_date
    // if last_claim_daily_date more than 48 hours ago, reset last_claim_daily_day to 1
    // if more than 8 hrs and less than 48 hrs, give tokens and update
    // if less than 8 hrs, return error
    // if last_claim_daily_day == 7, give 500 tokens and reset last_claim_daily_day to 1
    const currentDate = new Date();
    const lastMineDate = user.last_mine_date;
    if (!lastMineDate) {
      user.last_mine_date = currentDate;
      user.balance += 50;
      await user.save();
      await this.usersService.addTransaction(user, 50, null, 'mine');
      return {
        status: 'ok',
        balance: user.balance,
      };
    }
    const diff =
      Math.abs(currentDate.getTime() - lastMineDate.getTime()) / 36e5;
    if (diff >= 8) {
      user.last_mine_date = currentDate;
      user.balance += 50;
      await user.save();
      await this.usersService.addTransaction(user, 50, null, 'mine');
      return {
        status: 'ok',
        balance: user.balance,
      };
    } else {
      throw new BadRequestException('Too early to claim');
    }
  }
}
