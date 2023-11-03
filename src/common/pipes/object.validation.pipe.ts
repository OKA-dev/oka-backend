import * as Joi from 'joi'
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common'

@Injectable()
export class ObjectValidationPipe implements PipeTransform {
  constructor(private schema: Joi.ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value)
    console.log('validation pipe received: ', JSON.stringify(value))
    if (error) {
      throw new BadRequestException(error, 'Validation failed')
    }
    return value
  }
}
