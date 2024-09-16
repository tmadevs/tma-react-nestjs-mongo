import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongoModule } from './mongo.module';
import { ConfigModule } from './config.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './categories/category.module';
import { EventModule } from './events/events.module';
import { PracticeModule } from './practices/practice.module';
import { ProfessionModule } from './professions/profession.module';
import { BotModule } from './bot/bot.module';
import { QuestModule } from './quests/quest.module';
import { I18nModule, AcceptLanguageResolver, QueryResolver, HeaderResolver } from 'nestjs-i18n';
import { join } from 'path';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    MongoModule,
    AuthModule,
    CategoryModule,
    EventModule,
    ProfessionModule,
    CategoryModule,
    PracticeModule,
    BotModule,
    QuestModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '../../shared/locales'),
        watch: true, // Enable hot-reload for translation files
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] }, // Resolves lang from query parameter ?lang=xx
        { use: HeaderResolver, options: ['x-custom-lang'] }, // Resolves lang from custom header x-custom-lang
        AcceptLanguageResolver, // Resolves lang from Accept-Language header
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

