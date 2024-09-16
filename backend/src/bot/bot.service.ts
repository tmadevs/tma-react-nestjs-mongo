import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Telegraf } from 'telegraf';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class BotService {
  public bot: Telegraf;
  private botName: string;
  private channelName: string;

  launch() {
    if (this.bot) {
      this.bot.launch();
    }
  }

  constructor(
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
  ) {
    const botToken = process.env.BOT_TOKEN;

    if (!botToken) {
      console.error(
        'Bot token is not defined. Please check your environment variables.',
      );
      throw new Error('Bot token is required for initializing Telegraf');
    }

    try {
      this.bot = new Telegraf(botToken);
      this.botName = process.env.BOT_NAME;
      this.channelName = process.env.CHANNEL_NAME;

      this.bot.start(async (ctx) => {
        const userLang = ctx.from.language_code || 'en';

        try {
          let user = await this.usersService.findOne({ id: ctx.from.id });

          if (!user) {
            user = new this.usersService.userModel({
              id: ctx.from.id,
              firstName: ctx.from.first_name,
              lastName: ctx.from.last_name,
              username: ctx.from.username,
              languageCode: ctx.from.language_code,
            });

            await user.save();
          }

          await this.sendStartMessage(userLang, ctx.from.id);
        } catch (error) {
          console.error('Error in bot start', error);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  public async sendStartMessage(userLang: string, id: number) {
    const botName = this.botName;
    const channelName = this.channelName;

    const startButtonText = this.i18n.t('translation.start_button_text', {
      lang: userLang,
    });
    const subscribeChannelText = this.i18n.t('translation.subscribe_channel', {
      lang: userLang,
    });
    const welcomeMessageText = this.i18n.t('translation.welcome_message', {
      lang: userLang,
    });

    try {
      let markup = {
        inline_keyboard: [
          [
            {
              text: startButtonText,
              url: `https://t.me/${botName}/onboarding`,
            },
          ],
          [{ text: subscribeChannelText, url: `https://t.me/${channelName}` }],
        ],
      };

      await this.bot.telegram.sendMessage(id, welcomeMessageText, {
        parse_mode: 'Markdown',
        reply_markup: markup,
      });
    } catch (error) {
      console.error(`Failed to send start message to user ${id}:`, error);
    }
  }
}
