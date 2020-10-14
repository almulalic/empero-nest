// import { Module } from '@nestjs/common';
// import { UsersModule } from '../users/users.module';
// import { PassportModule } from '@nestjs/passport';
// import { LocalStrategy } from './local.strategy';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { IdentityController } from './../Controllers';
// import { IdentityService } from './../../Services';

// @Module({
//   imports: [
//     UsersModule,
//     PassportModule,
//     ConfigModule,
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: async (configService: ConfigService) => ({
//         secret: configService.get('JWT_SECRET'),
//         signOptions: {
//           expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
//         },
//       }),
//     }),
//   ],
//   providers: [IdentityService, LocalStrategy],
//   controllers: [IdentityController],
// })
// export class AuthModule {}
