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
import { EventEmitter2 } from '@nestjs/event-emitter'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Public } from 'src/auth/public'
import { EventType } from 'src/event/event-type.enum'
import { UserCreatedEvent } from 'src/event/user-created-event.schema'
import { ObjectValidationPipe } from 'src/global/pipes/object.validation.pipe'
import { PasswordHashPipe } from 'src/global/pipes/password.hash.pipe'
import { PhoneNumberTransformPipe } from 'src/global/pipes/phone.transform.pipe'
import { Roles } from 'src/global/role.decorator'
import { Role } from 'src/global/role.enum'
import { AddressDso, AddressDto, AddressValidator } from './address.dto'
import { AddressService } from './address.service'
import { AddressTransformPipe } from './pipes/address.transform.pipe'
import { UserDto, UserDtoValidator } from './user.dto'
import { UserService } from './user.service'

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
    return req.user
  }

  @Roles(Role.User)
  @UsePipes(new ObjectValidationPipe(AddressValidator))
  @Post('/address')
  async addAddress(@Body(new AddressTransformPipe())address: AddressDso, @Request() req) {
    console.log('addresDso = ', address)
    address.user = req.user._id
    const saved = await this.addressService.save(address)
    return saved
  }

  @Roles(Role.User)
  @Get('/address')
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
