import { Body, Controller, Get, Post, Request, UnauthorizedException, UsePipes } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/public';
import { ObjectValidationPipe } from 'src/common/pipes/object.validation.pipe';
import { PasswordHashPipe } from 'src/common/pipes/password.hash.pipe';
import { PhoneNumberTransformPipe } from 'src/common/pipes/phone.transform.pipe';
import { Roles } from 'src/common/role.decorator';
import { Role } from 'src/common/role.enum';
import { UserDtoValidator, UserDto } from 'src/data/userdata/user.dto';
import { UserService } from 'src/data/userdata/user.service';
import { EventType } from 'src/event/event-type.enum';
import { UserCreatedEvent } from 'src/event/events/user/user-events.schema';

@ApiTags('Riders')
@Controller('riders')
export class RiderController {
  constructor(
    private userService: UserService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Public()
  @Post()
  @UsePipes(new ObjectValidationPipe(UserDtoValidator))
  async create(
    @Body(PhoneNumberTransformPipe, PasswordHashPipe) user: UserDto,
  ) {
    user.roles = [Role.Rider]
    const createdUser = await this.userService.create(user)
    createdUser.password = undefined
    this.eventEmitter.emit(EventType.UserAccountCreated, new UserCreatedEvent(createdUser))
    return createdUser
  }

  @Roles(Role.Rider)
  @Get()
  async getUser(@Request() req) {
    const user = req.user
    if (user && user._id) {
      return await this.userService.findById(user._id)
    } else {
      throw new UnauthorizedException()
    }
  }
}
