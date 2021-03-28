import * as Joi from "joi";
import { PhoneNumberDto, PhoneNumberValidator } from "src/data/userdata/user.dto";
import { UserAccountType } from "src/data/userdata/user.schema";

export interface FederatedDto {
  token: string
  type: UserAccountType
  phone: PhoneNumberDto
}

export const FederatedSignupDtoValidator = Joi.object({
  token: Joi.string().required(),
  type: Joi.string().valid(...Object.values(UserAccountType)).required(),
  phone: PhoneNumberValidator.required(),
})

export const FederatedLoginDtoValidator = Joi.object({
  token: Joi.string().required(),
  type: Joi.string().valid(...Object.values(UserAccountType)).required(),
})