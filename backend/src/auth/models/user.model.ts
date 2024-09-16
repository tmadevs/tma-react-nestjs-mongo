import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {
  _id: number;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String })
  lastName?: string;

  @Prop({ type: String })
  username?: string;

  @Prop({ type: Boolean })
  isPremium?: boolean;

  @Prop({ type: String, required: true })
  languageCode: string;

  @Prop({ type: Boolean, required: true })
  allowsWriteToPm: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);
