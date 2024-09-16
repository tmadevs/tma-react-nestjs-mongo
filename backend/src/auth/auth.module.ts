import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Algorithm } from 'jsonwebtoken';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        const algorithm = configService.get<string>(
          'JWT_ALGORITHM',
        ) as Algorithm;
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN');

        return {
          secret: secret,
          signOptions: {
            algorithm,
            expiresIn,
          },
          verifyOptions: {
            algorithms: [algorithm],
            ignoreExpiration: false,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
})
export class AuthModule {}
