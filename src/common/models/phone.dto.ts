import * as Joi from 'joi'
import { PhoneNumber } from 'src/data/addressdata/phonenumber'
import { PhoneNumberValidator } from 'src/data/userdata/user.dto'

export interface PhoneDto {
  phone: PhoneNumber
}

export const PhoneDtoValidator = Joi.object({
  phone: PhoneNumberValidator.required(),
})

export interface PhoneCheckDto {
  id: string
  phone: PhoneNumber
  code: string
}

export const PhoneCheckDtoValidator = Joi.object({
  id: Joi.string().required(),
  phone: PhoneNumberValidator.required(),
  code: Joi.string().required()
})