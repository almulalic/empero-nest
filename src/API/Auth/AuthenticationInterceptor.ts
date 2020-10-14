import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import * as responseMessages from '../../../responseMessages.config.json';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { TokenCustomerDTO } from './../../Services/Identity/DTO/TokenCustomerDTO';

@Injectable()
export class AuthenticationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const token = context.switchToHttp().getRequest().headers['x-token'].slice(7);

    if (token) {
      jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decodedToken: TokenCustomerDTO) => {
        if (err) throw new HttpException(responseMessages.authorization.tokenMalformet, HttpStatus.UNAUTHORIZED);

        context.switchToHttp().getRequest().currentCustomer = decodedToken;
      });
    } else throw new HttpException(responseMessages.authorization.invalidToken, HttpStatus.UNAUTHORIZED);

    return next.handle();
  }
}
