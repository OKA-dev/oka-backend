import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UnauthorizedException,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Public } from 'src/auth/public'
import { EventType } from 'src/event/event-type.enum'
import { UserCreatedEvent } from 'src/event/events/user/user-events.schema'
import { ObjectValidationPipe } from 'src/common/pipes/object.validation.pipe'
import { PasswordHashPipe } from 'src/common/pipes/password.hash.pipe'
import { Roles } from 'src/common/role.decorator'
import { Role } from 'src/common/role.enum'
import { AddressValidator, AddressDso, AddressDto } from 'src/data/addressdata/address.dto'
import { AddressDataService } from 'src/data/addressdata/address.data.service'
import { AddressTransformPipe } from 'src/data/addressdata/pipes/address.transform.pipe'
import {  EmailSignupDto, EmailSignupDtoValidator } from 'src/data/userdata/user.dto'
import { UserDataService } from '../../data/userdata/user.data.service'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { FilesInterceptor } from '@nestjs/platform-express'
import { CloudStorageService } from 'src/common/services/cloud-storage.service'
import { PhotoDataService } from 'src/data/photo/photo.data.service'
import { Photo } from 'src/data/photo/photo.schema'
import { FederatedSignupDtoValidator, FederatedSignupDto } from 'src/auth/federated.dto'
import { UserAccountType } from 'src/data/userdata/user.schema'
import { AuthService } from 'src/auth/auth.service'
import { PhoneNumber } from 'src/data/addressdata/phonenumber'
import { LocationTransformPipe } from 'src/common/pipes/location-transform.pipe'
import { LatLongValidator, Point } from 'src/common/models/geojson'
import { TimedLocation } from 'src/data/addressdata/location.types'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private userService: UserDataService,
    private authService: AuthService,
    private addressService: AddressDataService,
    private cloudService: CloudStorageService,
    private photoService: PhotoDataService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Public()
  @Post()
  @UsePipes(new ObjectValidationPipe(EmailSignupDtoValidator))
  async create(
    @Body(PasswordHashPipe) body: EmailSignupDto,
  ) {
    let user = body.user
    const phone = await this.verifyPhoneToken(body.phoneVerificationToken)
    if (!phone) {
      throw new BadRequestException('Invalid phone verification token')
    }
    user.phone = phone
    const createdUser = await this.userService.create(user)
    createdUser.password = undefined
    this.eventEmitter.emit(EventType.UserAccountCreated, new UserCreatedEvent(createdUser))
    return createdUser
  }

  @Public()
  @Post('/federated')
  async federatedStartSignup(
    @Body(new ObjectValidationPipe(FederatedSignupDtoValidator))body: FederatedSignupDto, 
    @Request() req
    ) {
    const phone = await this.verifyPhoneToken(body.phoneVerificationToken)
    if (!phone) {
      throw new BadRequestException('Invalid phone verification token')
    }
    let userObject
    if (body.type == UserAccountType.Google) {
      userObject = await this.authService.validateGoogleToken(body.federatedToken)
    } else if (body.type == UserAccountType.Facebook) {
      userObject = await this.authService.validateFacebookToken(body.federatedToken)
    } else {
      throw new BadRequestException(`Unsupported federated login: ${body.type}`)
    }

    userObject = {
      ...userObject,
      accountType: body.type,
      password: '******',
      phone: phone
    }

    if (!userObject || !userObject.name || !userObject.email) {
      throw new BadRequestException()
    }

    const existingUser = await this.userService.findByEmail(userObject.email)
    if (existingUser) {
      throw new ConflictException('User with email already exists')
    }
    const createdUser = await this.userService.create(userObject)
    createdUser.password = undefined
    this.eventEmitter.emit(EventType.UserAccountCreated, new UserCreatedEvent(createdUser))
    return createdUser
  }
  
  @Roles(Role.User)
  @Get()
  async getUser(@Request() req) {
    const user = req.user
    if (user && user._id) {
      let fullUser = await this.userService.findById(user._id)
      return await this.userService.withPhotoUrls(fullUser)
    } else {
      throw new UnauthorizedException()
    }
  }

  @Roles(Role.User)
  @UsePipes(new ObjectValidationPipe(AddressValidator))
  @ApiBody({ type: AddressDto })
  @Post('/addresses')
  async addAddress(@Body(new AddressTransformPipe())address: AddressDso, @Request() req) {
    address.user = req.user._id
    return await this.addressService.save(address)
  }

  @Roles(Role.User)
  @Get('/addresses')
  async getAddresses(@Request() req) {
    return await this.addressService.findAddressForUser(req.user._id)
  }
  
  @Roles(Role.User)
  @Delete('/addresses/:id')
  async deleteAddress(@Param() params, @Request() req) {
    const address = await this.addressService.findOne(params.id)
    if (address.user._id !== req.user._id) {
      throw new ForbiddenException()
    }
    return await this.addressService.deleteAddress(params.id)
  }

  @Roles(Role.User)
  @Post('/photo')
  @UseInterceptors(FilesInterceptor('file'))
  async uploadFile(@UploadedFiles() files: Express.Multer.File, @Request() req) {
    const file = files[0]
    if (!file) {
      throw new BadRequestException('invalid file')
    }
    console.log('file = ', file)
    const storageKey = await this.cloudService.uploadPublicFile(file.buffer, file.filename)
    let photo = new Photo(req.user._id, storageKey)
    // todo: save to user
    photo = await this.photoService.save(photo)
    return await this.userService.setPhoto(req.user._id, photo._id)
  }

  @Roles(Role.User)
  @Delete('/photo/:id')
  async deletePhoto(@Param() params, @Request() req) {
    const id = params.id
    let photo = await this.photoService.findOne(id)
    if (photo.user != req.user._id) {
      throw new ForbiddenException('You are not allowed to delete this photo')
    }
    await this.photoService.findOneAndDelete(id)
    const result = await this.cloudService.deletePublicFile(photo.key)
    console.log('delete file result = ', result)
    // todo delete from user
    return result
  }

  @Roles(Role.User)
  @UsePipes(new ObjectValidationPipe(LatLongValidator))
  @Put('/location')
  async updateLocation(@Body(new LocationTransformPipe())point: Point, @Request() req) {
    let timedLocation = new TimedLocation(new Date(), point)
    let result = await this.userService.setLocation(req.user._id, timedLocation)
    return result
  }

  private async verifyPhoneToken(token: string): Promise<PhoneNumber> {
    const jwtPayload = await this.authService.jwtVerify(token)
    if (!(jwtPayload.countryCode && jwtPayload.number && jwtPayload.e164)) {
      return null
    }
    const phone = new PhoneNumber()
    phone.countryCode = jwtPayload.countryCode
    phone.number = jwtPayload.number
    phone.e164 = jwtPayload.e164 
    return phone
  }
}
