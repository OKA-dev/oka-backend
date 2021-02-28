import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { Role } from 'src/common/role.enum'
import { User } from 'src/models/userdata/user.schema'
import { UserService } from 'src/models/userdata/user.service'

@Injectable()
export class AdminValidationInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest()
    const requestUser: any = request.user
    if (!requestUser) {
      throw new ForbiddenException()
    }
    const dbUser: User = await this.userService.findById(requestUser._id)
    const adminRole = Role.Admin
    if (dbUser.roles.includes(adminRole)) {
      return next.handle()
    } else {
      throw new ForbiddenException()
    }
  }
}
