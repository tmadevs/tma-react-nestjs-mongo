import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';  
import { Types, Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';
import { User } from './user.entity';

@Schema({  
  timestamps: true,  
})
export class Transaction extends Document {  
  _id: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: User.name })  
  user: string;

  @Prop({ required: true })  
  type: string;

  @Prop({ required: false, nullable: true })  
  questId: number;

  @Prop({ required: true })  
  amount: number;

  createdAt: Date;  
  updatedAt: Date;  
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);