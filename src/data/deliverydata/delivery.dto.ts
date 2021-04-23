import * as Joi from 'joi'
import { LatLongValidator } from 'src/common/models/geojson';
import { AddressDso, AddressDto } from '../addressdata/address.dto';

export class DeliveryDto {
  start: AddressDto
  end: AddressDto
}

export class DeliveryDso {
  start: AddressDso
  end: AddressDso
  sender?: any
  
  static fromDto(dto: DeliveryDto): DeliveryDso {
    let dso: DeliveryDso = {
      start: AddressDso.createDso(dto.start),
      end: AddressDso.createDso({...dto.end})
    }
    return dso
  }
}

export const DeliveryAddressValidator = Joi.object({
  line1: Joi.string().required(),
  line2: Joi.string(),
  city: Joi.string().required(),
  state: Joi.string(),
  postalCode: Joi.string(),
  country: Joi.string().required(),
  location: LatLongValidator.required(),
})

export const DeliveryDtoValidator = Joi.object({
  start: DeliveryAddressValidator.required(),
  end: DeliveryAddressValidator.required()
})

export const DeliveryReasonValidator = Joi.object({
  reason: Joi.string().required(),
})

export const DelieryProblemValidator = Joi.object({
  message: Joi.string().required()
})

export const DeliveryDropOffValidator = Joi.object({
  code: Joi.string().required(),
})
