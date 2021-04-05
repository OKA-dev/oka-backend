import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as mongoose from 'mongoose'
import { Model } from "mongoose";
import { DeliveryDso } from "src/data/deliverydata/delivery.dto";
import { Delivery, DeliveryDocument, DeliveryProblem, DeliveryStatus } from "src/data/deliverydata/delivery.schema";

@Injectable()
export class DeliveryDataService {
  constructor(@InjectModel(Delivery.name) private model: Model<DeliveryDocument>) {}

  async create(deliveryToCreate: DeliveryDso) {
    const created = new this.model(deliveryToCreate)
    return created.save()
  }

  async findById(id: string): Promise<Delivery> {
    return await this.model.findById(id)
  }

  async findPopulatedById(id: string): Promise<Delivery> {
    return await this.model.findById(id)
      .populate('sender')
      .populate('rider')
      .populate('recipient')
      .populate('problem')
  }

  async findDeliveriesForSender(userId: string): Promise<Delivery[]> {
    const query: any = { sender: new mongoose.Types.ObjectId(userId) }
    return await this.model.find(query).exec()
  }

  async findDeliveriesForRecipient(userId: string): Promise<Delivery[]> {
    const query: any = { recipient: new mongoose.Types.ObjectId(userId) }
    return await this.model.find(query).exec()
  }

  async findDeliveriesForRider(userId: string): Promise<Delivery[]> {
    const query: any = { rider: new mongoose.Types.ObjectId(userId) }
    return await this.model.find(query)
  }

  async setStatus(id: string, status: DeliveryStatus): Promise<Delivery> {
    const value = await this.model.findOneAndUpdate({_id: id}, {
      $set: { status: status },
    },
    {new: true})
    return value
  }

  async setPickedUp(id: string) {
    const value = await this.model.findOneAndUpdate(
      {_id: id}, 
      {
        $set: { status: DeliveryStatus.EnRoute, pickupTime: new Date() }
    },
    {new: true})
    return value
  }

  async setDroppedOff(id: string) {
    const value = await this.model.findOneAndUpdate(
      {_id: id}, 
      {
        $set: { status: DeliveryStatus.Delivered, dropoffTime: new Date() }
    },
    {new: true})
    return value
  }

  async setRider(id: string, riderId?: string): Promise<Delivery> {
    const riderObj: any = { rider: new mongoose.Types.ObjectId(riderId) }
    const value = await this.model.findOneAndUpdate(
      { _id: id }, 
      { $set: riderObj }, 
      { new: true }
      )
    return value 
  }

  async setStatusAndRider(id: string, status: DeliveryStatus, riderId: string) {
    const riderObj: any = { status: status, rider: riderId }
    const value = await this.model.findOneAndUpdate(
      { _id: id }, 
      { $set: riderObj }, 
      {new: true}
    )
    return value  
  }

  async setProblem(id: string, problem: DeliveryProblem): Promise<Delivery> {
    const delivery = await this.model.findOneAndUpdate(
      { _id: id },
      { $set: { problem: problem }},
      { new: true }
    )
    return delivery
  }

}
