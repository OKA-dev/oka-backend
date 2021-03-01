import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsInt, IsObject, IsString } from 'class-validator'
import * as Joi from 'joi'

export class PhoneNumberDto {
  @IsInt()
  @ApiProperty()
  number: string

  @IsInt()
  @ApiProperty()
  countryCode: string

  e164: string
}

export class UserDto {
  @IsString()
  @ApiProperty()
  name: string

  @IsEmail()
  @ApiProperty()
  email: string

  @IsString()
  @ApiProperty()
  password: string

  @IsObject()
  @ApiProperty()
  phone: PhoneNumberDto
}

export const PhoneNumberValidator = Joi.object({
  countryCode: Joi.number().required(),
  number: Joi.number().required(),
})

export const UserDtoValidator = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
  phone: PhoneNumberValidator.required(),
})
