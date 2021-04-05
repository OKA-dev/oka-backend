import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Photo, PhotoDocument } from './photo.schema';

@Injectable()
export class PhotoDataService {
  constructor(@InjectModel(Photo.name) private documentModel: Model<PhotoDocument>) {}

  async save(photo: Photo): Promise<Photo> {
    const model = await this.documentModel.create(photo)
    return await model.save()
  }

  async findOne(id: string): Promise<Photo> {
    return await this.documentModel.findById(id)
  }

  async findOneAndDelete(id: string): Promise<Photo> {
    return await this.documentModel.findByIdAndDelete(id)
  }
}
