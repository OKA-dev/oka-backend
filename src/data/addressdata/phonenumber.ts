import { Prop, Schema } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import * as Joi from 'joi'

@Schema()
export class PhoneNumber {
  @Prop()
  number: string
  @Prop()
  countryCode: string
  @Prop({ unique: true })
  e164?: string
}


export class PhoneNumberDto {
  @IsInt()
  @ApiProperty()
  number: string

  @IsInt()
  @ApiProperty()
  countryCode: string

  e164?: string
}


export const PhoneNumberDtoValidator = Joi.object({
  countryCode: Joi.string().required(),
  number: Joi.string().required(),
})