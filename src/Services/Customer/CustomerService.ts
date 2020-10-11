import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Customer } from '../../Models/Entities';
import { ICustomerService } from './../Contracts/ICustomerService';
import { RegisterDTO, LoginDTO, LoginResponseDTO } from './DTO';
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

    dto.password = await Credential.EncryptPassword(dto.password);

    try {
      await Mailer.SendConfirmationEmail(customer.id, customer);
    } catch (err) {
      return err.message;
    }

    await this.entityManager.getRepository(Customer).insert(dto);

    return responseMessages.customer.register.success;
  }

  ResendConfirmationCode(body: any): Promise<string> {
    throw new Error('Method not implemented.');
  }
  ChangeConfirmationEmail(body: any): Promise<string> {
    throw new Error('Method not implemented.');
  }
  ConfirmIdentity(token: string): Promise<string> {
    throw new Error('Method not implemented.');
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
