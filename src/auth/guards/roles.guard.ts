import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from 'src/common/role.decorator'
import { Role } from 'src/common/role.enum'
import { IS_PUBLIC } from '../public'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    console.log('requiredRoles = ', requiredRoles)
    if (!requiredRoles) {
      console.log('no required roles')
      return false
    }
    const { user } = context.switchToHttp().getRequest()
    return requiredRoles.some((role) => user.roles.includes(role))
  }
}
