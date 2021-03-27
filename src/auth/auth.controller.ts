import { BadRequestException, Body, ConflictException, Controller, NotFoundException, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ApiTags } from '@nestjs/swagger'
import { ObjectValidationPipe } from 'src/common/pipes/object.validation.pipe'
import { PhoneNumberTransformPipe } from 'src/common/pipes/phone.transform.pipe'
import { UserAccountType } from 'src/data/userdata/user.schema'
import { UserService } from 'src/data/userdata/user.service'
import { AuthService } from './auth.service'
import { FederatedDto, FederatedLoginDtoValidator, FederatedSignupDtoValidator } from './federated.dto'
import JwtFederatedGuard from './guards/jwt-federated.guard'
import JwtRefreshGuard from './guards/jwt-refresh.guard'
import { LocalAuthGuard } from './guards/local.auth.guard'
import { Public } from './public'
import { FacebookAuthStrategy } from './strategies/facebook-auth.strategy'
import { GoogelAuthStrategy } from './strategies/google-auth.strategy'


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private googelAuth: GoogelAuthStrategy,
    private jwtService: JwtService,
    private userService: UserService,
    private facebookAuth: FacebookAuthStrategy) {}

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
        userObject = await this.facebookAuth.process(body.token)
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

  @Post('/federated/user')
  @UseGuards(JwtFederatedGuard)
  async federatedSignup(@Body() body) {
      const payload = this.jwtService.verify(body.token)
  }
}
