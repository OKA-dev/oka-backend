import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class Country {
  @Prop()
  name: string

  @Prop()
  niceName: string

  @Prop()
  iso3: string

  @Prop()
  iso: string

  @Prop()
  isRestricted: string
  
  @Prop()
  isBlocked: string
  
  @Prop()
  countryCode: number
}

export type CountryDocument = Country & Document
export const CountrySchema = SchemaFactory.createForClass(Country)
