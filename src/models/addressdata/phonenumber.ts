import { Prop, Schema } from '@nestjs/mongoose'

@Schema()
export class PhoneNumber {
  @Prop()
  number: string
  @Prop()
  countyCode: string
  @Prop({ unique: true })
  e164?: string
}
