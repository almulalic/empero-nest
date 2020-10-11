import {
  RegisterDTO,
  LoginDTO,
  LoginResponseDTO,
  RefreshTokenDTO,
  RefreshTokenResponseDTO,
} from '../../Services/Customer/DTO';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CustomerService } from './../../Services/Customer/CustomerService';

@Controller('customer')
export class CustomerController {
  constructor(private readonly CustomerService: CustomerService) {}

  @Get('/:email')
  public async IsValidEmail(@Param('email') email: string): Promise<boolean> {
    return await this.CustomerService.IsValidEmail(email);
  }

  @Post('/register')
  public async Register(@Body() body: RegisterDTO): Promise<string> {
    return await this.CustomerService.Register(body);
  }

  @Post('/login')
  public async Login(@Body() body: LoginDTO): Promise<LoginResponseDTO> {
    return await this.CustomerService.Login(body);
  }

  @Post('/refreshToken')
  public async RefreshToken(@Param('id') body: RefreshTokenDTO): Promise<RefreshTokenResponseDTO> {
    return await this.CustomerService.RefreshToken(body);
  }
}
