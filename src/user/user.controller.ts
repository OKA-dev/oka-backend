import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Public } from 'src/auth/public.decorator'
import { ObjectValidationPipe } from 'src/global/pipes/object.validation.pipe'
import { PasswordHashPipe } from 'src/global/pipes/password.hash.pipe'
import { PhoneNumberTransformPipe } from 'src/global/pipes/phone.transform.pipe'
import { Roles } from 'src/global/role.decorator'
import { Role } from 'src/global/role.enum'
import { UserDto, UserDtoValidator } from './user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post()
  @UsePipes(new ObjectValidationPipe(UserDtoValidator))
  async create(
    @Body(PhoneNumberTransformPipe, PasswordHashPipe) user: UserDto,
  ) {
    const createdUser = await this.userService.create(user)
    createdUser.password = undefined
    return createdUser
  }

  // @UseGuards(RolesGuard)
  @Roles(Role.User)
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
  @Roles(Role.User)
  async findByEmail(@Query('email') email: string) {
    return { status: 'ok' }
  }
}
