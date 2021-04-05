import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { Role } from 'src/common/role.enum'
import { User } from 'src/data/userdata/user.schema'
import { UserDataService } from 'src/data/userdata/user.data.service'

@Injectable()
export class AdminValidationInterceptor implements NestInterceptor {
  constructor(private userService: UserDataService) {}

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
