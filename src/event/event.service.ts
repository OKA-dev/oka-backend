import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  RiderCreatedEvent,
  RiderCreatedEventDocument,
} from './rider-created-event.schema'
import {
  UserCreatedEvent,
  UserCreatedEventDocument,
} from './user-created-event.schema'

@Injectable()
export class EventService {
  constructor(
    @InjectModel(UserCreatedEvent.name)
    private userCreatedModel: Model<UserCreatedEventDocument>,
    @InjectModel(RiderCreatedEvent.name)
    private riderCreatedModel: Model<RiderCreatedEventDocument>,
  ) {}

  async saveUserCreatedEvent(event: UserCreatedEvent) {
    const newModel = await this.userCreatedModel.create(event)
    newModel.save()
  }
}
