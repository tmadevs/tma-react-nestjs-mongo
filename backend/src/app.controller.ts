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
    this.botService.launch();
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
}
