import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../userdata/user.schema';
import * as mongoose from 'mongoose'
import { CloudStorageObject } from 'src/common/models/cloud-storage-object';

@Schema({ timestamps: true})
export class Photo implements CloudStorageObject {
  _id: string
  
  constructor(userId: string, key: string) {
    this.user = userId
    this.key = key
  }
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  user: User | string

  @Prop({required: true, unique: true})
  key: string

  @Prop({type: String, required: false, })
  url: string

  setUrl(url: string) {
    this.url = url
  }
}
export type PhotoDocument = Photo & mongoose.Document
export const PhotoSchema = SchemaFactory.createForClass(Photo)
