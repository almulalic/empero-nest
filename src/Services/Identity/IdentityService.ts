import {
  RegisterDTO,
  LoginDTO,
  LoginResponseDTO,
  ResendConfirmationDTO,
  ChangeConfirmationEmailDTO,
  ConfirmResetPasswordDTO,
  ResetPasswordDTO,
} from './DTO';
import { EntityManager } from 'typeorm';
import { Mailer } from '../../Microservices/Mail/Mailer';
import { IIdentityService } from '../Contracts';
import { Credential } from '../../Common/Credential';
import { InjectEntityManager } from '@nestjs/typeorm';
import { RefreshTokenDTO } from './DTO/RefreshTokenDTO';
import { TokenCustomerDTO } from './DTO/TokenCustomerDTO';
import { Customer, TokenLog } from '../../Models/Entities';
import { TokenLogger, TokenType } from '../../Common/TokenLogger';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as responseMessages from '../../../responseMessages.config.json';

@Injectable()
export class IdentityService implements IIdentityService {
  constructor(
    @InjectEntityManager()
    private EntityManager: EntityManager,
    private TokenLogger: TokenLogger,
  ) {}

  public async IsEmailTaken(email: string): Promise<boolean> {
    return (await this.EntityManager.getRepository(Customer).findOne({ email: email })) !== undefined;
  }

  public async Register(dto: RegisterDTO): Promise<string> {
    let customer: Customer = await this.EntityManager.getRepository(Customer).findOne({ email: dto.email });
    if (customer) throw new HttpException(responseMessages.identity.register.emailAlreadyInUse, HttpStatus.BAD_REQUEST);

    let newCustomer: Customer = dto;
    newCustomer.password = await Credential.EncryptPassword(newCustomer.password);
    newCustomer.id = (await this.EntityManager.getRepository(Customer).insert(newCustomer)).generatedMaps[0].id;

    let confirmationToken: string = await Credential.GenerateConfirmationToken(newCustomer.id, '1d');
    await this.TokenLogger.AddNewTokenLog(confirmationToken, '1d', TokenType.AccountConfirmationToken, newCustomer.id);
    let confirmationMailResponse = await Mailer.SendConfirmationEmail(newCustomer, confirmationToken);

    return responseMessages.identity.register.success + confirmationMailResponse;
  }

  public async ResendConfirmationToken(dto: ResendConfirmationDTO): Promise<string> {
    let customer: Customer = await this.EntityManager.getRepository(Customer).findOne({ email: dto.email });

    if (!customer)
      throw new HttpException(responseMessages.identity.resendConfirmation.nonExistingCustomer, HttpStatus.BAD_REQUEST);
    else if (customer.isConfirmed)
      throw new HttpException(responseMessages.identity.resendConfirmation.alreadyConfirmed, HttpStatus.BAD_REQUEST);

    let newConfirmationToken = await Credential.GenerateConfirmationToken(customer.id, '1d');
    this.TokenLogger.AddNewTokenLog(newConfirmationToken, '1d', TokenType.AccountConfirmationToken, customer.id);

    return await Mailer.ResendConfirmationEmail(customer, newConfirmationToken);
  }

  public async ChangeConfirmationEmail(dto: ChangeConfirmationEmailDTO): Promise<string> {
    let customer: Customer = await this.EntityManager.getRepository(Customer).findOne({ email: dto.email });

    if (!customer)
      throw new HttpException(responseMessages.identity.resendConfirmation.nonExistingCustomer, HttpStatus.BAD_REQUEST);
    else if (customer.isConfirmed)
      throw new HttpException(responseMessages.identity.resendConfirmation.alreadyConfirmed, HttpStatus.BAD_REQUEST);

    if (!(await Credential.DecryptPassword(dto.password, customer.password)))
      throw new HttpException(responseMessages.identity.login.customerNotFound, HttpStatus.FORBIDDEN);

    customer.email = dto.newEmail;

    await this.EntityManager.getRepository(Customer).save(customer);

    return responseMessages.identity.resendConfirmation.success;
  }

  public async ConfirmIdentity(token: string): Promise<string> {
    let tokenLog: TokenLog = await this.TokenLogger.GetToken(token);

    if (!tokenLog || tokenLog.isValid === false)
      throw new HttpException(responseMessages.identity.confirmIdentity.tokenExpieredOrInvalid, HttpStatus.BAD_REQUEST);

    let decodedToken;

    try {
      decodedToken = await Credential.DecodeRegisterConfirmationToken(tokenLog.token);
    } catch (err) {
      throw new HttpException(responseMessages.identity.confirmIdentity.tokenMalformed, HttpStatus.BAD_REQUEST);
    }

    let confirmedCustomer: Customer = await this.EntityManager.getRepository(Customer).findOne({
      id: decodedToken.identityId,
    });

    if (confirmedCustomer.isConfirmed)
      throw new HttpException(responseMessages.identity.confirmIdentity.alreadyConfirmed, HttpStatus.BAD_REQUEST);

    confirmedCustomer.isConfirmed = true;

    await this.TokenLogger.InvalidateToken(tokenLog);

    await this.EntityManager.getRepository(Customer).save(confirmedCustomer);

    return responseMessages.identity.confirmIdentity.success;
  }

  public async ResetPassword(dto: ResetPasswordDTO): Promise<string> {
    let customer: Customer = await this.EntityManager.getRepository(Customer).findOne({ email: dto.email });

    if (!customer)
      throw new HttpException(
        responseMessages.identity.passwordResetRequest.nonExistingIdentity,
        HttpStatus.BAD_REQUEST,
      );

    let token = await Credential.GenerateResetPasswordToken(customer, '24h');

    this.TokenLogger.AddNewTokenLog(token, '24h', TokenType.PasswordResetToken, customer.id);

    await Mailer.SendResetPasswordEmail(customer, token);

    return responseMessages.identity.passwordResetRequest.success;
  }

  public async ConfimPasswordReset(dto: ConfirmResetPasswordDTO): Promise<string> {
    let tokenLog: TokenLog = await this.TokenLogger.GetToken(dto.token);

    if (!tokenLog || !tokenLog.isValid)
      throw new HttpException(
        responseMessages.identity.passwordResetConfirmation.tokenExpieredOrInvalid,
        HttpStatus.BAD_REQUEST,
      );

    let decodedToken;

    try {
      decodedToken = await Credential.DecodePasswordResetToken(dto.token);
    } catch (err) {
      throw new HttpException(
        responseMessages.identity.passwordResetConfirmation.tokenMalformed,
        HttpStatus.BAD_REQUEST,
      );
    }

    let customer: Customer = await this.EntityManager.getRepository(Customer).findOne({ id: decodedToken.id });

    if (!customer)
      throw new HttpException(
        responseMessages.identity.passwordResetConfirmation.nonExistingIdentity,
        HttpStatus.BAD_REQUEST,
      );

    customer.password = await Credential.EncryptPassword(dto.newPassword);

    await this.TokenLogger.InvalidateToken(tokenLog);

    await this.EntityManager.getRepository(Customer).save(customer);

    return responseMessages.identity.passwordResetConfirmation.success;
  }

  public async Login(dto: LoginDTO): Promise<LoginResponseDTO> {
    let customer: Customer = await this.EntityManager.getRepository(Customer).findOne({ email: dto.email });

    if (!customer) throw new HttpException(responseMessages.identity.login.customerNotFound, HttpStatus.NOT_FOUND);

    if (!customer.isConfirmed)
      throw new HttpException(responseMessages.identity.login.notConfirmed, HttpStatus.BAD_REQUEST);

    if (!(await Credential.DecryptPassword(dto.password, customer.password)))
      throw new HttpException(responseMessages.identity.login.wrongPassword, HttpStatus.FORBIDDEN);

    let tokenUser: TokenCustomerDTO = new TokenCustomerDTO(customer);

    let refreshToken = await Credential.GenerateRefreshToken(tokenUser, '1h');

    customer.refreshToken = refreshToken;

    await this.EntityManager.getRepository(Customer).save(customer);

    return {
      access_token: await Credential.GenerateAccessToken(tokenUser, '1h'),
      refresh_token: refreshToken,
    };
  }

  public async RefreshToken(dto: RefreshTokenDTO): Promise<any> {
    if (!dto.refreshToken || dto.refreshToken === null)
      throw new HttpException(responseMessages.identity.refresh.nonExistingRefreshToken, HttpStatus.UNAUTHORIZED);

    let customer: Customer = await this.EntityManager.getRepository(Customer).findOne({
      refreshToken: dto.refreshToken,
    });

    if (!customer) throw new HttpException(responseMessages.identity.login.customerNotFound, HttpStatus.NOT_FOUND);

    if (!(await Credential.VerifyJWT(dto.refreshToken)))
      throw new HttpException(responseMessages.identity.refresh.nonExistingRefreshToken, HttpStatus.UNAUTHORIZED);

    return {
      accessToken: await Credential.GenerateAccessToken(new TokenCustomerDTO(customer), '1h'),
    };
  }
}
