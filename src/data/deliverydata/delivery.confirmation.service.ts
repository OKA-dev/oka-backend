import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as mongoose from 'mongoose'
import { DeliveryConfirmation, DeliveryConfirmationDocument } from './delivery.confirmation.schema'
import { Delivery } from './delivery.schema'

@Injectable()
export class DeliveryConfirmationService {
  constructor(@InjectModel(DeliveryConfirmation.name) private model: Model<DeliveryConfirmationDocument>){}

  async save(confirmation: DeliveryConfirmation): Promise<DeliveryConfirmation> {
    const newModel = await this.model.create(confirmation)
    return newModel.save()
  }

  async findByDeliveryId(deliveryId: string): Promise<DeliveryConfirmation> {
    const query: any = {'delivery': new mongoose.Types.ObjectId(deliveryId)}
    return await this.model.findOne(query)
  }
}