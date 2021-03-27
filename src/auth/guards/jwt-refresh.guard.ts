import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtRefreshStrategy } from '../strategies/jwt-refresh-strategy';
 
@Injectable()
export default class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') 
implements CanActivate {
  constructor(
    private strategy: JwtRefreshStrategy,
  ) {
    super()
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    return await this.validateRequest(request)
  }

  private async validateRequest(request: Request): Promise<boolean> {
    const jwtToken = this.extractToken(request.headers['authorization'])
    if (jwtToken) {
      request.user = await this.strategy.validate(jwtToken)
      return request.user != null 
    } else {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractToken(authHeader: string) : string {
    if (authHeader.startsWith('Bearer ')) {
      const token =  authHeader.substring(7, authHeader.length)
      return token
    }
    return null
  }
}
