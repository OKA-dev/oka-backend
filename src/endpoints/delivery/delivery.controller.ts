import { BadRequestException, Body, ConflictException, Controller, ForbiddenException, Get, Param, Patch, Post, Put, Req, Request, UsePipes } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ObjectValidationPipe } from 'src/common/pipes/object.validation.pipe';
import { Roles } from 'src/common/role.decorator';
import { Role } from 'src/common/role.enum';
import { DelieryProblemValidator, DeliveryDropOffValidator, DeliveryDso, DeliveryDto, DeliveryDtoValidator, DeliveryReasonValidator } from 'src/data/deliverydata/delivery.dto';
import { Delivery, DeliveryProblem, DeliveryStatus } from 'src/data/deliverydata/delivery.schema';
import { DeliveryTransformPipe } from 'src/data/deliverydata/pipes/delivery.transform.pipe';
import { EventType } from 'src/event/event-type.enum';
import { DeliveryCancelledEvent, DeliveryConfirmedEvent, DeliveryCreatedEvent, DeliveryDroppedOffEvent, DeliveryPickedUpEvent, DeliveryProblemEvent, DeliveryRiderCancelledEvent } from 'src/event/events/delivery/delivery-events.schema';
import { DeliveryDataService } from '../../data/deliverydata/delivery.data.service';
import * as mongoose from 'mongoose'
import { DeliveryConfirmationService } from 'src/data/deliverydata/delivery.confirmation.service';
import { DeliveryConfirmation } from 'src/data/deliverydata/delivery.confirmation.schema';

@ApiTags('Delivery')
@Controller('deliveries')
export class DeliveryController {

  constructor(
    private deliveryService: DeliveryDataService,
    private confirmationService: DeliveryConfirmationService,
    private eventEmitter: EventEmitter2) {}

  @Post()
  @ApiBody({ type: DeliveryDto })
  @Roles(Role.User)
  @UsePipes(new ObjectValidationPipe(DeliveryDtoValidator))
  async create(@Body(new DeliveryTransformPipe())delivery: DeliveryDso, @Request() req) {
    delivery.sender = {_id: req.user._id}
    let createdDelivery = await this.deliveryService.create(delivery)
    let confirmation = new DeliveryConfirmation(createdDelivery, this.generateConfirmationCode())
    await this.confirmationService.save(confirmation)

    this.eventEmitter.emit(EventType.DeliveryCreated, new DeliveryCreatedEvent(createdDelivery))
    return createdDelivery
  }

  @Get()
  @Roles(Role.User)
  async getDeliveries(@Request() req){
    return await this.deliveryService.findDeliveriesForSender(req.user._id)
  }

  @Get(':id')
  @Roles(Role.User)
  async getDelivery(@Param() params, @Request() req): Promise<Delivery> {
    const delivery = await this.deliveryService.findPopulatedById(params.id)
    if (delivery.sender._id != req.user._id) {
      throw new ForbiddenException()
    }
    return delivery
  }

  @Patch(':id/cancel')
  @Roles(Role.User)
  async cancelDelivery(
    @Body(new ObjectValidationPipe(DeliveryReasonValidator)) body,
    @Param() params, 
    @Request() req
    ): Promise<Delivery> {
    let delivery = await this.deliveryService.findById(params.id)
    if (delivery.sender._id != req.user._id) {
      throw new ForbiddenException()
    }

    if (delivery.status != DeliveryStatus.Pending && delivery.status != DeliveryStatus.Confirmed) {
      throw new BadRequestException('This delivery can not be cancelled. Please contact customer support if you need assistance.')
    }

    delivery = await this.deliveryService.setStatus(params.id, DeliveryStatus.Cancelled)
    this.eventEmitter.emit(EventType.DeliveryCancelled, new DeliveryCancelledEvent(
      delivery, 
      body.reason, 
      new mongoose.Types.ObjectId(req.user._id)
      ))
    return delivery
  }

  @Patch(':id/rider/cancel')
  @Roles(Role.Rider)
  async riderCancelDelivery(
    @Body(new ObjectValidationPipe(DeliveryReasonValidator)) body,
    @Param() params, 
    @Request() req) {
    const id = params.id
    let delivery = await this.deliveryService.findPopulatedById(id)
    if (delivery.status != DeliveryStatus.Confirmed) {
      throw new BadRequestException('This delivery can not be cancelled. Please contact customer service if you need assistance.')
    }
    
    if (!delivery.rider || delivery.rider._id != req.user._id) {
      throw new ForbiddenException()
    }
    delivery = await this.deliveryService.setStatusAndRider(id, DeliveryStatus.Pending, undefined)
    this.eventEmitter.emit(EventType.DeliveryCancelled, new DeliveryRiderCancelledEvent(
      delivery, 
      body.reason,
      new mongoose.Types.ObjectId(req.user._id)
      ))

    return delivery
  }

  @Patch(':id/rider/confirm')
  @Roles(Role.Rider)
  async confirmDelivery(@Param() params, @Request() req) {
    const id = params.id
    let delivery = await this.deliveryService.findById(id)
    if (delivery.status != DeliveryStatus.Pending) {
      throw new BadRequestException()
    }
    if (delivery.rider) {
      throw new ConflictException()
    }
    delivery = await this.deliveryService.setStatusAndRider(id, DeliveryStatus.Confirmed, req.user._id)
    console.log('rider set delivery: ', delivery)
    // handle race condition where two riders pick up a delivery at the same time
    // If another rider picks up this delivery before `confirmDelivery` returns,
    // that rider gets the ride
    delivery = await this.deliveryService.findPopulatedById(id)
    if (delivery.rider._id != req.user._id) {
      throw new ConflictException()
    }
    this.eventEmitter.emit(EventType.DeliveryConfirmed, new DeliveryConfirmedEvent(delivery))

    return delivery
  }

  @Patch(':id/rider/pickup')
  @Roles(Role.Rider)
  async pickUpDelivery(@Param() params, @Request() req) {
    const id = params.id
    let delivery = await this.deliveryService.findPopulatedById(id)
    if (delivery.status != DeliveryStatus.Confirmed) {
      throw new BadRequestException()
    }
    if (delivery.rider._id != req.user._id) {
      throw new ForbiddenException()
    }
    delivery = await this.deliveryService.setStatus(id, DeliveryStatus.EnRoute)
    this.eventEmitter.emit(EventType.DeliveryPickedUp, new DeliveryPickedUpEvent(delivery))
    return delivery
  }

  @Patch(':id/rider/dropoff')
  @Roles(Role.Rider)
  async dropOffDelivery(
    @Body(new ObjectValidationPipe(DeliveryDropOffValidator)) body,
    @Param() params, 
    @Request() req
    ) {
    const id = params.id
    const withConfirmationCode = true
    let delivery = await this.deliveryService.findPopulatedById(id)
    if (delivery.status != DeliveryStatus.EnRoute) {
      throw new BadRequestException()
    }
    if (delivery.rider._id != req.user._id) {
      throw new ForbiddenException()
    }
    const confirmation = await this.confirmationService.findByDeliveryId(delivery._id)
    if (body.code != confirmation.code) {
      // TODO: maximum 5 tries on a delivery
      throw new BadRequestException()
    }
    delivery = await this.deliveryService.setStatus(id, DeliveryStatus.Delivered)
    this.eventEmitter.emit(EventType.DeliveryDroppedOff, new DeliveryDroppedOffEvent(delivery))
    return delivery
  }

  @Patch(':id/rider/return')
  @Roles(Role.Rider)
  async returnDelivery() {
    // TODO
  }

  @Patch(':id/problem')
  @Roles(Role.User)
  async reportProblem(
    @Body(new ObjectValidationPipe(DelieryProblemValidator)) body: DeliveryProblem,
    @Param() params, 
    @Request() req, 
    ) {
    const id = params.id
    let delivery = await this.deliveryService.findById(id)
    if (delivery.sender._id != req.user._id) {
      throw new ForbiddenException()
    }
    if (delivery.problem) {
      throw new BadRequestException()
    }
    delivery = await this.deliveryService.setProblem(id, body)
    this.eventEmitter.emit(EventType.DeliveryProblem, new DeliveryProblemEvent(delivery, body.message))
    return delivery
  }

  @Patch(':id/rider/problem')
  @Roles(Role.Rider)
  async reportRiderPrblem(
    @Body(new ObjectValidationPipe(DelieryProblemValidator)) body: DeliveryProblem,
    @Param() params, 
    @Request() req,
    ) {
    const id = params.id
    let delivery = await this.deliveryService.findById(id)
    if (delivery.rider._id != req.user._id) {
      throw new ForbiddenException()
    }
    if (delivery.problem) {
      throw new BadRequestException()
    }
    delivery = await this.deliveryService.setProblem(id, body)
    this.eventEmitter.emit(EventType.DeliveryRiderProblem, new DeliveryProblemEvent(delivery, body.message))
    return delivery
  }

  private generateConfirmationCode(): string {
    const min = 10000
    const max = 99999
    return Math.floor(Math.random() * (max - min) + min).toString()
  }

}
