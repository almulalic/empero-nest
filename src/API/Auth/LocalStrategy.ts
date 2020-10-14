import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IdentityService } from '../../Services';
import { LoginDTO } from '../../Services/Identity/DTO';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private IdentityService: IdentityService) {
    super();
  }

  async validate(dto: LoginDTO): Promise<any> {
    const customer = await this.IdentityService.Login(dto);

    if (!customer) {
      throw new UnauthorizedException();
    }
    return customer;
  }
}
