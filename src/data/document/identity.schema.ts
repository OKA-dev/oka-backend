import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { CloudStorageObject } from 'src/common/models/cloud-storage-object'
import { User } from '../userdata/user.schema'

export enum DocumentType {
  DriversLicense = 'drivers-license',
  NationalID = 'national-id',
  Passport = 'passport',
  VoterID = 'voter-id',
  Other = 'other',
}

export enum DocumentState {
  New = 'new',
  Pending = 'pending',
  Approved = 'approved',
  Declined = 'declined',
}

@Schema({timestamps: true})
export class Identity implements CloudStorageObject {
  constructor(userId: string, documentType: DocumentType, key: string, documentNumber?: string) {
    this.user = userId
    this.key = key
    this.documentType = documentType
    this.documentNumber = documentNumber
  }

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
  user: User | string

  @Prop({type: String, enum: Object.values(DocumentType), required: true})
  documentType: DocumentType

  @Prop({required: true})
  key: string

  @Prop({required: false, unique: true})
  documentNumber?: string

  @Prop({required: true, enum: Object.values(DocumentState), default: DocumentState.New })
  state: DocumentState

  @Prop({type: String, required: false})
  url: string
}

export type IdentityDocument = Identity & mongoose.Document
export const IdentitySchema = SchemaFactory.createForClass(Identity)
