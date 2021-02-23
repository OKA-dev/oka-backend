import { Body, Controller, Get, NotFoundException, Post, Query, Request, UnauthorizedException, UseGuards, UsePipes } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard'
import { ObjectValidationPipe } from 'src/global/pipes/object.validation.pipe'
import { PasswordHashPipe } from 'src/global/pipes/password.hash.pipe'
import { PhoneNumberTransformPipe } from 'src/global/pipes/phone.transform.pipe'
import { ValidationPipe } from 'src/global/pipes/validation.pipe'
import { UserDto, UserDtoValidator } from './user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @UsePipes(new ObjectValidationPipe(UserDtoValidator))
  async create(
    @Body(PhoneNumberTransformPipe, PasswordHashPipe) user: UserDto,
  ) {
    const createdUser = await this.userService.create(user)
    createdUser.password = undefined
    return createdUser
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@Request() req) {
    const user = req.user
    if (user && user._id) {
      const fetchedUser = await this.userService.findById(user._id)
      console.log(' got user: ', fetchedUser)
      return fetchedUser
    } else {
      throw new UnauthorizedException()
    }
    return req.user
  }

  @Get('/random')
  async findByEmail(@Query('email') email: string) {
    console.log('getting user by email: ', email)
    const user = await this.userService.findByEmail(email)
    if (user) {
      return user
    }
    throw new NotFoundException('User not found')
  }
}
