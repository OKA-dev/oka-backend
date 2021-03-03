import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as mongoose from 'mongoose'
import { Model } from "mongoose";
import { DeliveryDso } from "src/data/deliverydata/delivery.dto";
import { Delivery, DeliveryDocument, DeliveryStatus } from "src/data/deliverydata/delivery.schema";

@Injectable()
export class DeliveryService {
  constructor(@InjectModel(Delivery.name) private model: Model<DeliveryDocument>) {}

  async create(deliveryToCreate: DeliveryDso) {
    const created = new this.model(deliveryToCreate)
    return created.save()
  }

  async findById(id: string): Promise<Delivery> {
    return await this.model.findById(id)
  }

  async findDeliveriesForUser(userId: string): Promise<Delivery[]> {
    const query: any = { sender: new mongoose.Types.ObjectId(userId) }
    return await this.model.find(query).exec()
  }

  async setStatus(id: string, status: DeliveryStatus): Promise<Delivery> {
    const value = await this.model.findOneAndUpdate({_id: id}, {
      $set: { status: status },
    })
    return value
  }
}
