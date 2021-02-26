import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EventType } from './event-type.enum'
import { EventService } from './event.service'
import { UserCreatedEvent } from './user-created-event.schema'

@Injectable()
export class GlobalEventListener {
  constructor(private eventService: EventService) {}

  @OnEvent(EventType.UserAccountCreated, { nextTick: true })
  handleUserCreatedEvent(payload: UserCreatedEvent) {
    console.log('** event listener got payload: ', payload)
    this.eventService.saveUserCreatedEvent(payload)
  }
}
