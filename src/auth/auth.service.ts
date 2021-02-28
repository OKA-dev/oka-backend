import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Hasher } from 'src/common/util/hasher'
import { User } from 'src/models/userdata/user.schema'
import { UserService } from 'src/models/userdata/user.service'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
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
    const payload = { email: user.email, sub: user._id, roles: user.roles }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
