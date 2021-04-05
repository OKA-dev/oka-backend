import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as mongoose from 'mongoose'
import { AddressDso } from "./address.dto";
import { Address, AddressDocument } from "./address.schema";

@Injectable()
export class AddressDataService {
  constructor(@InjectModel(Address.name) private addressModel: Model<AddressDocument>) {}

  async save(address: AddressDso): Promise<Address> {
    const model = await this.addressModel.create(address)
    return model.save()
  }

  async findOne(id: string) {
    return await this.addressModel.findById(id)
  }
  
  async findAddressForUser(userId: string): Promise<Address[]> {
    const query: any = { user: new mongoose.Types.ObjectId(userId) }
    return await this.addressModel.find(query).exec()
  }

  async deleteAddress(id: string) {
    return await this.addressModel.deleteOne({_id: new mongoose.Types.ObjectId(id)})
  }
}