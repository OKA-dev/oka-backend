import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Public } from 'src/auth/public'
import { EventType } from 'src/event/event-type.enum'
import { UserCreatedEvent } from 'src/event/user-created-event.schema'
import { ObjectValidationPipe } from 'src/common/pipes/object.validation.pipe'
import { PasswordHashPipe } from 'src/common/pipes/password.hash.pipe'
import { PhoneNumberTransformPipe } from 'src/common/pipes/phone.transform.pipe'
import { Roles } from 'src/common/role.decorator'
import { Role } from 'src/common/role.enum'
import { AddressValidator, AddressDso } from 'src/models/addressdata/address.dto'
import { AddressService } from 'src/models/addressdata/address.service'
import { AddressTransformPipe } from 'src/models/addressdata/pipes/address.transform.pipe'
import { UserDtoValidator, UserDto } from 'src/models/userdata/user.dto'
import { UserService } from '../../models/userdata/user.service'

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private addressService: AddressService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Public()
  @Post()
  @UsePipes(new ObjectValidationPipe(UserDtoValidator))
  async create(
    @Body(PhoneNumberTransformPipe, PasswordHashPipe) user: UserDto,
  ) {
    const createdUser = await this.userService.create(user)
    createdUser.password = undefined
    this.eventEmitter.emit(EventType.UserAccountCreated, new UserCreatedEvent(createdUser))
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
  }

  @Roles(Role.User)
  @UsePipes(new ObjectValidationPipe(AddressValidator))
  @Post('/addresses')
  async addAddress(@Body(new AddressTransformPipe())address: AddressDso, @Request() req) {
    console.log('addresDso = ', address)
    address.user = req.user._id
    const saved = await this.addressService.save(address)
    return saved
  }

  @Roles(Role.User)
  @Get('/addresses')
  async getAddresses(@Request() req) {
    const addresses = await this.addressService.findAddressForUser(req.user._id)
    return addresses
  }

  @Get('/random')
  @Roles(Role.User)
  async findByEmail(@Query('email') email: string) {
    return { status: 'ok' }
  }
}
