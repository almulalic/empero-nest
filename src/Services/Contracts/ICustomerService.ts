import {
  RegisterDTO,
  LoginDTO,
  RefreshTokenDTO,
  LoginResponseDTO,
  RefreshTokenResponseDTO,
  ResendConfirmationDTO,
} from '../Customer/DTO';

export interface ICustomerService {
  IsValidEmail(email: string): Promise<boolean>;
  Register(dto: RegisterDTO): Promise<string>;
  ResendConfirmationToken(body: ResendConfirmationDTO): Promise<string>;
  ChangeConfirmationEmail(body): Promise<string>;
  ConfirmIdentity(token: string): Promise<string>;
  ResetPassword(body): Promise<string>;
  ConfimPasswordReset(body): Promise<string>;
  Login(dto: LoginDTO): Promise<LoginResponseDTO>;
  RefreshToken(dto: RefreshTokenDTO): Promise<RefreshTokenResponseDTO>;
}
