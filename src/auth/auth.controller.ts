import { Body, Controller, NotFoundException, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ObjectValidationPipe } from 'src/common/pipes/object.validation.pipe'
import { UserAccountType } from 'src/data/userdata/user.schema'
import { UserService } from 'src/data/userdata/user.service'
import { AuthService } from './auth.service'
import { FederatedDto, FederatedLoginDtoValidator } from './federated.dto'
import JwtRefreshGuard from './guards/jwt-refresh.guard'
import { LocalAuthGuard } from './guards/local.auth.guard'
import { Public } from './public'


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,) {}

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

  @Public()
  @Post('/login/federated')
  async federatedLogin(
    @Body(new ObjectValidationPipe(FederatedLoginDtoValidator))body: FederatedDto, 
  ) {
    let userObject
    switch (body.type) {
      case UserAccountType.Facebook:
        userObject = await this.authService.validateFacebookToken(body.token)
        break
      case UserAccountType.Google:
        userObject = await this.authService.validateGoogleToken(body.token)
    }

    if (!userObject || !userObject.email) {
      throw new UnauthorizedException()
    }
    const user = await this.userService.findByEmail(userObject.email)
    if (!user) {
      throw new NotFoundException()
    }

    return await this.authService.login(user)
  }
}
