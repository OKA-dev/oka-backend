import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from '@nestjs/passport'
import { Role } from "src/common/role.enum";
import JwtFederatedStrategy from "../strategies/jwt-federated.strategy";

@Injectable()
export default class JwtFederatedGuard extends AuthGuard('jwt') {

  constructor(
    private strategy: JwtFederatedStrategy, // todo: delete file, not needed
    private jwtService: JwtService,
    ) { 
    super()
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    return this.validate(request)
  }

  private validate(request: Request): boolean {
    const jwt = this.extractToken(request.headers['authorization'])
    if (jwt) {
      const payload = this.jwtService.verify(jwt)
      if (payload.roles != [Role.Signup]) {
        throw new UnauthorizedException()
      }
      return true
    } else {
      throw new UnauthorizedException()
    }
  }

  private extractToken(authHeader: string) : string {
    if (authHeader.startsWith('Bearer ')) {
      const token =  authHeader.substring(7, authHeader.length)
      return token
    }
    return null
  }
}