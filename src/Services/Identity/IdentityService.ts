import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Customer } from '../../Models/Entities';
import { IIdentityService } from '../Contracts';
import {
  RegisterDTO,
  LoginDTO,
  LoginResponseDTO,
  ResendConfirmationDTO,
  ChangeConfirmationEmailDTO,
  ConfirmResetPasswordDTO,
  ResetPasswordDTO,
} from './DTO';
import * as responseMessages from '../../../responseMessages.config.json';
import { Credential } from '../../Common/Credential';
import { TokenCustomerDTO } from './DTO/TokenCustomerDTO';
import { RefreshTokenDTO } from './DTO/RefreshTokenDTO';
import { Mailer } from '../../Mail/Mailer';

@Injectable()
export class IdentityService implements IIdentityService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  public async IsValidEmail(email: string): Promise<boolean> {
    return (await this.entityManager.getRepository(Customer).findOne({ email: email })) === undefined;
  }

  public async Register(dto: RegisterDTO): Promise<string> {
    let customer: Customer = await this.entityManager.getRepository(Customer).findOne({ email: dto.email });

    if (customer) throw new HttpException(responseMessages.customer.register.emailAlreadyInUse, HttpStatus.BAD_REQUEST);

    let newCustomer: Customer = dto;

    newCustomer.password = await Credential.EncryptPassword(newCustomer.password);

    newCustomer.id = (await this.entityManager.getRepository(Customer).insert(newCustomer)).generatedMaps[0].id;

    let confirmationMailResponse = await Mailer.SendConfirmationEmail(newCustomer.id, newCustomer);

    return responseMessages.customer.register.success + confirmationMailResponse;
  }

  public async ResendConfirmationToken(dto: ResendConfirmationDTO): Promise<string> {
    let customer: Customer = await this.entityManager.getRepository(Customer).findOne({ email: dto.email });

    if (!customer)
      throw new HttpException(responseMessages.customer.resendConfirmation.nonExistingCustomer, HttpStatus.BAD_REQUEST);
    else if (customer.isConfirmed)
      throw new HttpException(responseMessages.customer.resendConfirmation.alreadyConfirmed, HttpStatus.BAD_REQUEST);

    return await Mailer.ResendConfirmationEmail(customer);
  }

  public async ChangeConfirmationEmail(dto: ChangeConfirmationEmailDTO): Promise<string> {
    let customer: Customer = await this.entityManager.getRepository(Customer).findOne({ email: dto.email });

    if (!customer)
      throw new HttpException(responseMessages.customer.resendConfirmation.nonExistingCustomer, HttpStatus.BAD_REQUEST);
    else if (customer.isConfirmed)
      throw new HttpException(responseMessages.customer.resendConfirmation.alreadyConfirmed, HttpStatus.BAD_REQUEST);

    if (!(await Credential.DecryptPassword(dto.password, customer.password)))
      throw new HttpException(responseMessages.customer.login.customerNotFound, HttpStatus.FORBIDDEN);

    customer.email = dto.newEmail;

    await this.entityManager.getRepository(Customer).save(customer);

    return 'jest';
  }

  public async ConfirmIdentity(token: string): Promise<string> {
    if (token.length === 0) throw new HttpException('Kratak token', HttpStatus.BAD_REQUEST);

    let decodedToken;

    try {
      decodedToken = await Credential.DecodeConfirmationToken(token);
    } catch (err) {
      throw new HttpException('Token Malformed', HttpStatus.BAD_REQUEST);
    }

    let confirmedCustomer: Customer = await this.entityManager
      .getRepository(Customer)
      .findOne({ id: decodedToken.userIdentityId });

    if (confirmedCustomer.isConfirmed) throw new HttpException('Korisnik vec konfirman', HttpStatus.BAD_REQUEST);

    confirmedCustomer.isConfirmed = true;

    await this.entityManager.getRepository(Customer).save(confirmedCustomer);

    return 'true';
  }

  public async ResetPassword(dto: ResetPasswordDTO): Promise<string> {
    let customer: Customer = await this.entityManager.getRepository(Customer).findOne({ email: dto.email });

    if (!customer)
      throw new HttpException(responseMessages.customer.resendConfirmation.nonExistingCustomer, HttpStatus.BAD_REQUEST);

    await Mailer.SendResetPasswordEmail(customer);

    return 'jes';
  }

  public async ConfimPasswordReset(dto: ConfirmResetPasswordDTO): Promise<string> {
    let tokenizedCustomer: any = await Credential.VerifyJWT(dto.token);

    if (!tokenizedCustomer) throw new HttpException('nevalja', HttpStatus.FORBIDDEN);

    let customer: Customer = await this.entityManager
      .getRepository(Customer)
      .findOne({ email: tokenizedCustomer.email });

    if (!customer)
      throw new HttpException(responseMessages.customer.resendConfirmation.nonExistingCustomer, HttpStatus.BAD_REQUEST);

    customer.password = await Credential.EncryptPassword(dto.newPassword);

    await this.entityManager.getRepository(Customer).save(customer);

    return 'jest';
  }

  public async Login(dto: LoginDTO): Promise<LoginResponseDTO> {
    let customer: Customer = await this.entityManager.getRepository(Customer).findOne({ email: dto.email });

    if (!customer) throw new HttpException(responseMessages.customer.login.customerNotFound, HttpStatus.NOT_FOUND);

    if (!(await Credential.DecryptPassword(dto.password, customer.password)))
      throw new HttpException(responseMessages.customer.login.customerNotFound, HttpStatus.FORBIDDEN);

    let tokenUser: TokenCustomerDTO = new TokenCustomerDTO(customer);

    let refreshToken = await Credential.GenerateRefreshToken(tokenUser, '1h');

    customer.refreshToken = refreshToken;

    await this.entityManager.getRepository(Customer).save(customer);

    return {
      accessToken: await Credential.GenerateAccessToken(tokenUser, '1h'),
      refreshToken: refreshToken,
    };
  }

  public async RefreshToken(dto: RefreshTokenDTO): Promise<any> {
    if (!dto.refreshToken || dto.refreshToken === null)
      throw new HttpException(responseMessages.customer.refresh.nonExistingRefreshToken, HttpStatus.UNAUTHORIZED);

    let customer: Customer = await this.entityManager
      .getRepository(Customer)
      .findOne({ refreshToken: dto.refreshToken });

    if (!customer) throw new HttpException(responseMessages.customer.login.customerNotFound, HttpStatus.NOT_FOUND);

    if (!(await Credential.VerifyJWT(dto.refreshToken)))
      throw new HttpException(responseMessages.customer.refresh.nonExistingRefreshToken, HttpStatus.UNAUTHORIZED);

    return {
      accessToken: await Credential.GenerateAccessToken(new TokenCustomerDTO(customer), '1h'),
    };
  }
}
