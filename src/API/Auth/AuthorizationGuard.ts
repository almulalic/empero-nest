import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log(context.switchToHttp().getRequest().currentCustomer);
    return context.switchToHttp().getRequest().currentCustomer.role;
  }
}
