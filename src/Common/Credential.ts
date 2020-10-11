import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { async } from 'rxjs/internal/scheduler/async';
import { TokenCustomerDTO } from '../Services/Customer/DTO';

export class Credential {
  private static _salt: number = Number(process.env.PASSWORD_SALT);
  private static _jwtRefreshSecret: string = process.env.JWT_REFRESH_SECRET;
  private static _jwtEmailSecret: string = process.env.EMAIL_SECRET;

  public static EncryptPassword = async (password: string): Promise<string> => {
    return await new Promise((resolve, reject) => {
      bcrypt.hash(password, Credential._salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  };

  public static DecryptPassword = async (recievedPassword: string, password: string): Promise<boolean> => {
    return bcrypt.compare(recievedPassword, password);
  };

  public static VerifyJWT = async (refreshToken: string): Promise<boolean> => {
    return await new Promise((resolve, reject) => {
      jwt.verify(refreshToken, Credential._jwtRefreshSecret, (err) => {
        console.log(err);
        if (err) reject(err);
        resolve(true);
      });
    });
  };

  public static GenerateConfirmationToken = async (id: number, expiresIn: string): Promise<string> => {
    return await jwt.sign({ userIdentityId: id }, Credential._jwtEmailSecret, {
      expiresIn: expiresIn,
    });
  };

  public static DecodeConfirmationToken = async (token: string): Promise<TokenCustomerDTO> => {
    return jwt.verify(token, Credential._jwtEmailSecret);
  };
}
