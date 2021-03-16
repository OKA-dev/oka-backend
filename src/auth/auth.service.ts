import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AppConfigService } from 'src/appconfig/app.config.service'
import { Role } from 'src/common/role.enum'
import { Hasher } from 'src/common/util/hasher'
import { User } from 'src/data/userdata/user.schema'
import { UserService } from 'src/data/userdata/user.service'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private appConfig: AppConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const withPassword = true
    const user = await this.userService.findByEmail(email, withPassword)
    if (user && user.password) {
      const match = await Hasher.compare(password, user.password)
      if (match) {
        user.password = undefined
        return user
      } else {
        return null
      }
    }
  }

  async login(user: User) {
    const accessTokenPayload = { email: user.email, sub: user._id, roles: user.roles }
    const refreshTokenPayload = {email: user.email, sub: user._id, roles: [ Role.Refresh ]}
    const accessToken = this.jwtService.sign(accessTokenPayload)
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {expiresIn: '180 days', secret: this.appConfig.jwtSecret})
    const hashedToken = await Hasher.hash(refreshToken)
    await this.userService.setRefreshToken(user._id, hashedToken)
    return {
      sessionToken: accessToken,
      refreshToken: refreshToken,
    }
  }

  async refreshToken(user: User) {
    const accessTokenPayload = { email: user.email, sub: user._id, roles: user.roles }
    const sessionToken = this.jwtService.sign(accessTokenPayload)
    return {
      sessionToken: sessionToken
    }
  }
}
