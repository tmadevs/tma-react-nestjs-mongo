import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InitData } from '../auth/auth.utils';
import { Transaction } from './entities/transaction.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) public readonly userModel: Model<User>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private configService: ConfigService,

  ) {}

  async addTransaction(user, amount, questId = null, type = 'quest_complete') {
    const newTransaction = new this.transactionModel({
      user: user._id,
      questId,
      amount,
      type,
    });
    return await newTransaction.save();
  }

  findOneById(id: any) {
    return this.userModel.findOne({ _id: id }).exec();
  }

  findOne(params: any) {
    return this.userModel.findOne(params).exec();
  }

  find(params: any, params2 = null) {
    return this.userModel.find(params, params2).exec();
  }

  async findUsersByTelegramChat(chatId: string): Promise<User[]> {
    return await this.userModel.find({
      telegram_chats: { $elemMatch: { id: Number(chatId) } },
    });
  }

  async findOrCreateTelegramUser(initData: InitData) {
    let user = await this.userModel.findOne({ id: initData.user.id }).exec();
    if (user) {
      return user;
    }

    const newUser = new this.userModel({
      id: initData.user.id,
      firstName: initData.user.first_name,
      lastName: initData.user.last_name,
      username: initData.user.username,
      languageCode: initData.user.language_code,
    });
    user = await newUser.save();
    return this.userModel.findById(user._id).exec();
  }

  async update(userId: string, updateData: Partial<User>): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .exec();
  }

  async getUserProfile(id: string) {
    try {
      const user = await this.userModel.findOne({ id: id }).exec();
      if (!user) throw new UnauthorizedException();
      return user;
    } catch (e) {
      console.error(e);
    }
  }

  async addReferral(referrerId: string, referralId: string) {
    try {
      const referralBonus = this.configService.get<number>('REFERRAL_BONUS') || 0;

      // Find the referrer by ID
      const referrer = await this.userModel.findOne({ id: referrerId }).exec();
      if (!referrer) throw new NotFoundException();

      // Find the referral by ID and ensure it has no referrer yet
      const referral = await this.userModel
        .findOne({
          _id: referralId,
          referrerId: null,
          createdAt: {
            $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          },
        })
        .exec();

      if (!referral) throw new NotFoundException();

      // Ensure the referrer and referral are not the same user
      if (referrer.id == referral.id) throw new NotFoundException();

      // Add the referral ID to the referrer's referrals array
      if (!referrer.referrals) {
        referrer.referrals = [referralId];
      } else {
        referrer.referrals.push(referralId);
      }

      // Update the referrer's balance atomically and set the referrals array
      await this.userModel.updateOne(
        { id: referrerId },
        {
          $set: { referrals: referrer.referrals },
          $inc: { balance: referralBonus }, 
        },
      );

      // Update the referral's referrer_id and balance atomically
      await this.userModel.updateOne(
        { _id: referralId },
        {
          $set: { referrerId },
          $inc: { balance: referralBonus }, 
        },
      );

      // Return the updated referrer
      return await this.userModel.findOne({ id: referrerId }).exec();
    } catch (error) {
      // Abort the transaction in case of error
      throw error;
    }
  }
}
