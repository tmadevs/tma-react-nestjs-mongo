import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InitData, createWebAppSecret, decodeInitData, verifyTelegramWebAppInitData, } from "./auth.utils";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}


  validateMiniAppInitData(raw: string): InitData {
    const token = this.configService.get<string>('BOT_TOKEN');
    const initData = decodeInitData(raw);
    const secretKey = createWebAppSecret(token);


    console.log (process.env.ENV);
    if (process.env.ENV === 'production' && !verifyTelegramWebAppInitData(initData, secretKey)) {
      console.log(process.env.ENV);
      throw new Error("Invalid init data");
    }

    return initData;
  }

  createAccessToken(id: string, _id: string): string {
    const payload = {
      _id: _id,
      sub: id,
    };

    return this.jwtService.sign(payload);
  }
}
