import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { Role } from 'src/common/role.enum'
import { User } from 'src/data/userdata/user.schema'
import { UserDataService } from 'src/data/userdata/user.data.service'

@Injectable()
export class AdminValidationMiddleware implements NestMiddleware {
  constructor(private userService: UserDataService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const requestUser: any = req.user
    if (!requestUser) {
      console.log('** no request user')
      throw new ForbiddenException()
    }
    const dbUser: User = await this.userService.findById(requestUser._id)
    const adminRole = Role.Admin
    console.log('dbUser = ', dbUser)
    if (dbUser.roles.includes(adminRole)) {
      next()
    } else {
      console.log('** roles do not include admin')
      throw new ForbiddenException()
    }
  }
}
