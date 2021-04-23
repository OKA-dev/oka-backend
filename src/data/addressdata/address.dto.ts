import { ApiProperty } from '@nestjs/swagger'
import * as Joi from 'joi'
import { LatLong, LatLongValidator, Point } from 'src/common/models/geojson'

export class AddressDto {
  @ApiProperty({ description: 'The name for this address. E.g. "Home" or "Work"' })
  label: string
  @ApiProperty()
  line1: string
  @ApiProperty()
  line2?: string
  @ApiProperty()
  city: string
  @ApiProperty()
  state?: string
  @ApiProperty()
  postalCode?: string
  @ApiProperty()
  country: string
  isDefault: boolean
  @ApiProperty()
  location: LatLong
}

export class AddressDso {
  user?: string
  label: string
  line1: string
  line2?: string
  city: string
  state?: string
  postalCode?: string
  country: string
  isDefault?: boolean
  location: Point 

  static createDso(dto: AddressDto) {
    let dso: AddressDso = {... dto, location: new Point(dto.location.longitude, dto.location.latitude)}
    return dso
  } 
}

export const AddressValidator = Joi.object({
  label: Joi.string().required(),
  line1: Joi.string().required(),
  line2: Joi.string(),
  city: Joi.string().required(),
  state: Joi.string(),
  postalCode: Joi.string(),
  country: Joi.string().required(),
  location: LatLongValidator.required(),
})
