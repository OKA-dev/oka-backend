import { Body, Controller, Get, Post } from '@nestjs/common'
import { UserDto } from './user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() user: UserDto) {
    const createdUser = await this.userService.create(user)
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
