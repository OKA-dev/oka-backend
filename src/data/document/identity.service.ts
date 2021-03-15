import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose'
import { Identity, IdentityDocument } from './identity.schema';

@Injectable()
export class IdentityService {
  constructor(@InjectModel(Identity.name) private documentModel: Model<IdentityDocument>) {}

  async save(doc: Identity): Promise<Identity> {
    const model = await this.documentModel.create(doc)
    return model.save()
  }

  async findOne(id: string): Promise<Identity> {
    return await this.documentModel.findById(id)
  }

  async findDocumentsForUser(userId: string): Promise<Identity[]> {
    const query: any = {user: new mongoose.Types.ObjectId(userId)}
    return await this.documentModel.find(query).exec()
  }
}
