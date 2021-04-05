import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { PhoneNumberWrapper, UserDto } from 'src/data/userdata/user.dto'
import { PhoneUtil } from '../util/phone.util'

@Injectable()
export class PhoneNumberTransformPipe implements PipeTransform {
  transform(value: PhoneNumberWrapper, metadata: ArgumentMetadata): PhoneNumberWrapper {
    const phone = value.phone
    if (!phone.countryCode || !phone.number) {
      throw new BadRequestException(
        'Invalid phone number:' + phone.countryCode + ' ' + phone.number,
      )
    }
    const phoneUtil = new PhoneUtil()
    phone.e164 = phoneUtil.e164Number(phone.countryCode, phone.number)
    return value
  }
}
