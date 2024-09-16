import { User } from "@telegram-apps/sdk-react";

export type UserModel = User & {
  _id?: string;
};