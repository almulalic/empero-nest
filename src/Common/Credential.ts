import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { identity } from 'rxjs';
import { async } from 'rxjs/internal/scheduler/async';
import { Customer } from '../Models/Entities';
import { TokenCustomerDTO } from '../Services/Identity/DTO';

export class Credential {
  private static readonly _salt: number = Number(process.env.PASSWORD_SALT);
  private static readonly _jwtAccessSecret: string = process.env.JWT_ACCESS_SECRET;
  private static readonly _jwtRefreshSecret: string = process.env.JWT_REFRESH_SECRET;
  private static readonly _jwtEmailSecret: string = process.env.EMAIL_SECRET;
  private static readonly _resetPasswordSecret: string = process.env.RESET_PASSWORD_SECRET;

  public static async EncryptPassword(password: string): Promise<string> {
    return await new Promise((resolve, reject) => {
      bcrypt.hash(password, Credential._salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  }

  public static async DecryptPassword(recievedPassword: string, password: string): Promise<boolean> {
    return bcrypt.compare(recievedPassword, password);
  }

  public static async VerifyJWT(refreshToken: string): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      jwt.verify(refreshToken, Credential._jwtRefreshSecret, (err) => {
        console.log(err);
        if (err) reject(err);
        resolve(true);
      });
    });
  }

  public static async GenerateConfirmationToken(id: number, expiresIn: string): Promise<string> {
    return await jwt.sign({ userIdentityId: id }, Credential._jwtEmailSecret, {
      expiresIn: expiresIn,
    });
  }

  public static async DecodeConfirmationToken(token: string): Promise<TokenCustomerDTO> {
    return jwt.verify(token, Credential._jwtEmailSecret);
  }

  public static async GenerateAccessToken(tokenCustomer: TokenCustomerDTO, expiresIn: string): Promise<string> {
    return await jwt.sign({ currentCustomer: tokenCustomer }, Credential._jwtAccessSecret, {
      expiresIn: expiresIn,
    });
  }

  public static async GenerateRefreshToken(tokenCustomer: TokenCustomerDTO, expiresIn: string): Promise<string> {
    return await jwt.sign({ currentCustomer: tokenCustomer }, Credential._jwtRefreshSecret, {
      expiresIn: expiresIn,
    });
  }

  public static async GenerateResetPasswordToken(identity: Customer, expiresIn: string): Promise<string> {
    return await jwt.sign({ userIdentityId: identity.id }, Credential._resetPasswordSecret, {
      expiresIn: expiresIn,
    });
  }
}
