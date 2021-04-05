import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PhoneNumber } from "../addressdata/phonenumber";
import { Verification, VerificationDocument } from "./verification.schema";

@Injectable()
export class VerificationDataService {
  constructor(
    @InjectModel(Verification.name) private model: Model<VerificationDocument>
  ) {}

  async create(v: {phone: PhoneNumber, code: string}): Promise<Verification> {
    const verification = new this.model(v)
    return await verification.save()
  }

  async findById(id: string) :Promise<Verification> {
    return await this.model.findById(id)
  }

  async setTimesChecked(id: string, timesChecked: number) {
    return await this.model.findOneAndUpdate(
      {_id: id},
      {$set: {timesChecked: timesChecked}},
      {new: true}
      )
  }

  async updateById(id: string, updates: any) {
    return await this.model.findOneAndUpdate(
      {_id: id},
      {$set: updates},
      {new: true}
      )
  }
}