import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common'
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

  @Get()
  findById(id: string) {

  }

  @Get()
  findByEmail(email: string) {

  }

  @Get()
  find(query: any) {

  }
}
