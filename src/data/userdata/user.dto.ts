import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsInt, IsObject, IsString } from 'class-validator'
import * as Joi from 'joi'
import { Role } from 'src/common/role.enum'
import { PhoneNumber, PhoneNumberDto } from '../addressdata/phonenumber'
import { PhoneDto } from 'src/common/models/phone.dto'

export interface PhoneNumberWrapper {
  phone: PhoneNumber
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

  phone?: PhoneNumber

  roles?: Role[]
}

export class EmailSignupDto {
  @ApiProperty()
  user: UserDto

  @ApiProperty()
  phoneVerificationToken?: string
}

export class EmailSignupDtoNoVerification {
  @ApiProperty()
  user: UserDto
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
  phone: PhoneNumberValidator,
})

export const EmailSignupDtoValidator = Joi.object({
  user: UserDtoValidator.required(),
  phoneVerificationToken: Joi.string().required(),
})

export const EmailSignupDtoNoPhoneVerificationValidator = Joi.object({
  user: UserDtoValidator.required(),
  phone: PhoneNumberValidator.required()
})
