import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { EmailSignupDto, UserDto } from 'src/data/userdata/user.dto'
import { Hasher } from '../util/hasher'

@Injectable()
export class PasswordHashPipe implements PipeTransform {
  async transform(
    value: EmailSignupDto,
    metadata: ArgumentMetadata,
  ): Promise<EmailSignupDto> {
    const password = value.user.password
    value.user.password = await Hasher.hash(password)
    return value
  }
}

@Injectable()
export class PasswordStarPipe implements PipeTransform {
  async transform(
    value: UserDto,
    metadata: ArgumentMetadata,
  ): Promise<UserDto> {
    const password = value.password
    value.password = '******'
    return value
  }
}
