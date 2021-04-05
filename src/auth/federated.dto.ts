import * as Joi from "joi";
import { PhoneNumberDto } from "src/data/addressdata/phonenumber";
import { PhoneNumberValidator } from "src/data/userdata/user.dto";
import { UserAccountType } from "src/data/userdata/user.schema";

export interface FederatedDto {
  token: string
  type: UserAccountType
  phone: PhoneNumberDto
}

export interface FederatedSignupDto {
  type: UserAccountType
  federatedToken: string
  phoneVerificationToken: string
}

export const FederatedSignupDtoValidator = Joi.object({
  type: Joi.string().valid(...Object.values(UserAccountType)).required(),
  federatedToken: Joi.string().required(),
  phoneVerificationToken: Joi.string().required(),
})

export const FederatedLoginDtoValidator = Joi.object({
  token: Joi.string().required(),
  type: Joi.string().valid(...Object.values(UserAccountType)).required(),
})