import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InitData } from '../auth/auth.utils';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) public readonly userModel: Model<User>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
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
}
