import {
  RegisterDTO,
  LoginDTO,
  LoginResponseDTO,
  RefreshTokenDTO,
  RefreshTokenResponseDTO,
  ResendConfirmationDTO,
  ResetPasswordDTO,
  ConfirmResetPasswordDTO,
} from '../../Services/Identity/DTO';
import { Ok, OkResponse } from '../../Common';
import { IdentityService } from './../../Services';
import { Body, Controller, Get, Param, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ChangeConfirmationEmailDTO } from './../../Services/Identity/DTO/ChangeConfirmationEmailDTO';

@Controller('identity')
export class IdentityController {
  constructor(private readonly IdentityService: IdentityService) {}

  @Get('/isEmailTaken/:email')
  public async IsEmailTaken(@Param('email') email: string): Promise<OkResponse> {
    return Ok(await this.IdentityService.IsEmailTaken(email));
  }

  @Post('/register')
  public async Register(@Body() body: RegisterDTO): Promise<OkResponse> {
    return Ok(await this.IdentityService.Register(body));
  }

  @Post('/resendConfirmationCode')
  public async ResendConfirmationToken(@Body() body: ResendConfirmationDTO): Promise<OkResponse> {
    return Ok(await this.IdentityService.ResendConfirmationToken(body));
  }

  @Get('/confirm/:token')
  public async ConfirmIdentity(@Param('token') token: string): Promise<OkResponse> {
    return Ok(await this.IdentityService.ConfirmIdentity(token));
  }

  @Post('/changeConfriamtionEmail')
  public async ChangeConfirmationEmail(@Body() body: ChangeConfirmationEmailDTO): Promise<OkResponse> {
    return Ok(await this.IdentityService.ChangeConfirmationEmail(body));
  }

  @Post('/resetPassword')
  public async ResetPassword(@Body() body: ResetPasswordDTO): Promise<OkResponse> {
    return Ok(await this.IdentityService.ResetPassword(body));
  }

  @Post('/confirmPasswordReset')
  public async ConfimPasswordReset(@Body() body: ConfirmResetPasswordDTO): Promise<OkResponse> {
    return Ok(await this.IdentityService.ConfimPasswordReset(body));
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  public async Login(@Body() dto: LoginDTO): Promise<LoginResponseDTO> {
    return await this.IdentityService.Login(dto);
  }

  @Post('/refreshToken')
  public async RefreshToken(@Param('id') body: RefreshTokenDTO): Promise<RefreshTokenResponseDTO> {
    return await this.IdentityService.RefreshToken(body);
  }
}
