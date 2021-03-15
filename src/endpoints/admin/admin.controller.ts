import { Controller, Get, UseInterceptors } from '@nestjs/common'
import { Roles } from 'src/common/role.decorator'
import { Role } from 'src/common/role.enum'
import { AdminValidationInterceptor } from './admin-validation.interceptor'

@Controller('admin')
@UseInterceptors(AdminValidationInterceptor)
export class AdminController {
  @Get()
  @Roles(Role.Admin)
  getAll() {
    return { status: 'ok' }
  }
}
