import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import * as responseMessages from '../../../responseMessages.config.json';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { TokenCustomerDTO } from './../../Services/Identity/DTO/TokenCustomerDTO';

@Injectable()
export class AuthenticationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let token = context.switchToHttp().getRequest().headers['x-token'];

    if (token) {
      token = token.slice(7);

      jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decodedToken: TokenCustomerDTO) => {
        if (err) throw new HttpException(responseMessages.authorization.tokenMalformet, HttpStatus.UNAUTHORIZED);

        context.switchToHttp().getRequest().currentCustomer = Object.values(decodedToken)[0];
      });
    } else throw new HttpException(responseMessages.authorization.missingToken, HttpStatus.UNAUTHORIZED);

    return next.handle();
  }
}
