import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Customer } from '../../Models/Entities';
import { ICustomerService } from './../Contracts/ICustomerService';
import { RegisterDTO, LoginDTO, LoginResponseDTO, ResendConfirmationDTO } from './DTO';
import * as responseMessages from '../../../responseMessages.config.json';
import { Credential } from './../../Common/Credential';
import { TokenCustomerDTO } from './DTO/TokenCustomerDTO';
import { jwt } from 'jsonwebtoken';
import { RefreshTokenDTO } from './DTO/RefreshTokenDTO';
import { Mailer } from '../../Mail/Mailer';

@Injectable()
export class CustomerService implements ICustomerService {
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

  ChangeConfirmationEmail(body: any): Promise<string> {
    throw new Error('Method not implemented.');
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

    confirmedCustomer.isConfirmed = true;

    await this.entityManager.getRepository(Customer).save(confirmedCustomer);

    return 'true';
  }
  ResetPassword(body: any): Promise<string> {
    throw new Error('Method not implemented.');
  }
  ConfimPasswordReset(body: any): Promise<string> {
    throw new Error('Method not implemented.');
  }

  public async Login(dto: LoginDTO): Promise<LoginResponseDTO> {
    let customer: Customer = await this.entityManager.getRepository(Customer).findOne({ email: dto.email });

    if (!customer) throw new HttpException(responseMessages.customer.login.customerNotFound, HttpStatus.NOT_FOUND);

    if (!(await Credential.DecryptPassword(dto.password, customer.password)))
      throw new HttpException(responseMessages.customer.login.customerNotFound, HttpStatus.FORBIDDEN);

    let tokenUser: TokenCustomerDTO = new TokenCustomerDTO(customer);

    let accessToken = jwt.sign({ currentCustomer: tokenUser }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '1h',
    });

    let refreshToken = jwt.sign({ currentCustomer: tokenUser }, process.env.JWT_REFRESH_SECRET);

    customer.refreshToken = refreshToken;

    await this.entityManager.getRepository(Customer).save(customer);

    return {
      accessToken: accessToken,
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
      accessToken: jwt.sign({ currentCustomer: new TokenCustomerDTO(customer) }, process.env.JWT_ACCESS_SECRET),
    };
  }
}
