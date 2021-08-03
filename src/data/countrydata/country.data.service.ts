import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose"
import { Country, CountryDocument } from "./country.schema";

@Injectable()
export class CountryDataService {
  constructor(@InjectModel(Country.name) private countryModel: Model<CountryDocument>) {}

  async findOne(id: string) {
    return await this.countryModel.findById(id)
  }

  async findOneByIso(iso: string) {
    return await this.countryModel.findOne({ iso: iso })
  }

  async findAll() {
    return await this.countryModel.find()
  }
}