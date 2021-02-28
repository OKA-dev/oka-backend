import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { UserDto } from 'src/models/userdata/user.dto'
import { Hasher } from '../util/hasher'

@Injectable()
export class PasswordHashPipe implements PipeTransform {
  async transform(
    value: UserDto,
    metadata: ArgumentMetadata,
  ): Promise<UserDto> {
    const password = value.password
    value.password = await Hasher.hash(password)
    return value
  }
}
