import { BadRequestException, Body, Controller, Get, Post, Request, UnauthorizedException, UploadedFiles, UseInterceptors, UsePipes } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/public';
import { ObjectValidationPipe } from 'src/common/pipes/object.validation.pipe';
import { PasswordHashPipe } from 'src/common/pipes/password.hash.pipe';
import { PhoneNumberTransformPipe } from 'src/common/pipes/phone.transform.pipe';
import { Roles } from 'src/common/role.decorator';
import { Role } from 'src/common/role.enum';
import { CloudStorageService } from 'src/common/services/cloud-storage.service';
import { Identity, DocumentType, DocumentState } from 'src/data/document/identity.schema';
import { IdentityDataService } from 'src/data/document/identity.data.service';
import { IdentityValidator } from 'src/data/document/identity.validator';
import { UserDtoValidator, UserDto } from 'src/data/userdata/user.dto';
import { UserDataService } from 'src/data/userdata/user.data.service';
import { EventType } from 'src/event/event-type.enum';
import { UserCreatedEvent } from 'src/event/events/user/user-events.schema';

@ApiTags('Riders')
@Controller('riders')
export class RiderController {
  constructor(
    private userService: UserDataService,
    private identityService: IdentityDataService,
    private cloudService: CloudStorageService,
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

  @Roles(Role.Rider)
  @Post('/identity-documents')
  @UsePipes(new ObjectValidationPipe(IdentityValidator))
  @UseInterceptors(FilesInterceptor('file'))
  async submitDocs(@UploadedFiles()files: Express.Multer.File, @Body() body, @Request() req) {
    const file = files[0]
    let documentType = body.type
    if (!file) {
      throw new BadRequestException('invalid file')
    }

    if (!Object.values(DocumentType).includes(documentType)) {
      throw new BadRequestException(`Invalid document type: ${documentType}`)
    }

    documentType = documentType as DocumentType
    const storageKey = await this.cloudService.uploadPublicFile(file.buffer, file.name)
    const doc = new Identity(req.user._id, documentType, storageKey)
    return await this.identityService.save(doc)
  }

  @Roles(Role.Rider)
  @Get('/identity-documents')
  async getDocs(@Request() req) {
    let docs = await this.identityService.findDocumentsForUser(req.user._id)
    return Promise.all(docs.map(d => { return this.cloudService.getSignedUrlForObject(d) }))
  }
}
