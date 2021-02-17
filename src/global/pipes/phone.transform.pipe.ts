import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { UserDto } from 'src/user/user.dto'

@Injectable()
export class PhoneNumberTransformPipe implements PipeTransform {
  transform(value: UserDto, metadata: ArgumentMetadata): UserDto {
    const phone = value.phone
    if (!phone.countryCode || !phone.number) {
      throw new BadRequestException(
        'Invalid phone number:' + phone.countryCode + ' ' + phone.number,
      )
    }
    let phoneNumber = phone.number
    if (phoneNumber.startsWith('0')) {
      phoneNumber = phoneNumber.substring(1)
    }
    phone.e164 = `+${phone.countryCode}${phoneNumber}`
    return value
  }
}
