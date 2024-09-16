import { forwardRef, Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { BotChatService } from './bot-chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BotChat, BotChatSchema } from './entities/bot-chat.entity';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([{ name: BotChat.name, schema: BotChatSchema }]),
  ],
  providers: [BotService, BotChatService],
  exports: [BotService],
})
export class BotModule {}
