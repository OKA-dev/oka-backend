import { Controller, Post, Request, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/common/role.decorator'
import { Role } from 'src/common/role.enum'
import { AuthService } from './auth.service'
import JwtRefreshGuard from './guards/jwt-refresh.guard'
import { LocalAuthGuard } from './guards/local.auth.guard'
import { Public } from './public'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @Public()
  @Post('/refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user)
  }
}
