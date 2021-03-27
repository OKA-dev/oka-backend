import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { LocalStrategy } from '../strategies/local.strategy'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') implements CanActivate {
  constructor(private strategy: LocalStrategy) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    return await this.validateRequest(request)
  }

  private async validateRequest(request: Request): Promise<boolean> {
    const credentials = request.body
    if (!credentials.email || !credentials.password) {
      throw new BadRequestException('Invalid email or password')
    }
    const user = await this.strategy.validate(
      credentials.email,
      credentials.password,
    )
    request.user = user
    return user !== null
  }
}
