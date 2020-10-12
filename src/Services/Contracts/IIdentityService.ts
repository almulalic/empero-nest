import {
  LoginDTO,
  RegisterDTO,
  RefreshTokenDTO,
  LoginResponseDTO,
  ResetPasswordDTO,
  ResendConfirmationDTO,
  RefreshTokenResponseDTO,
  ConfirmResetPasswordDTO,
} from '../Identity/DTO';

export interface IIdentityService {
  IsEmailTaken(email: string): Promise<boolean>;
  Register(dto: RegisterDTO): Promise<string>;
  ChangeConfirmationEmail(body): Promise<string>;
  ResendConfirmationToken(body: ResendConfirmationDTO): Promise<string>;
  ConfirmIdentity(token: string): Promise<string>;
  ResetPassword(body: ResetPasswordDTO): Promise<string>;
  ConfimPasswordReset(body: ConfirmResetPasswordDTO): Promise<string>;
  Login(dto: LoginDTO): Promise<LoginResponseDTO>;
  RefreshToken(dto: RefreshTokenDTO): Promise<RefreshTokenResponseDTO>;
}
