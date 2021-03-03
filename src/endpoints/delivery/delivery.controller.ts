import { Body, Controller, Get, Post, Req, Request, UsePipes } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Point } from 'src/common/models/geojson';
import { ObjectValidationPipe } from 'src/common/pipes/object.validation.pipe';
import { Roles } from 'src/common/role.decorator';
import { Role } from 'src/common/role.enum';
import { DeliveryDso, DeliveryDto, DeliveryDtoValidator } from 'src/data/deliverydata/delivery.dto';
import { DeliveryTransformPipe } from 'src/data/deliverydata/pipes/delivery.transform.pipe';
import { DeliveryService } from './delivery.service';

@ApiTags('Delivery')
@Controller('deliveries')
export class DeliveryController {

  constructor(private deliveryService: DeliveryService) {}

  @Post()
  @ApiBody({ type: DeliveryDto })
  @Roles(Role.User)
  @UsePipes(new ObjectValidationPipe(DeliveryDtoValidator))
  async create(@Body(new DeliveryTransformPipe())delivery: DeliveryDso, @Request() req) {
    delivery.sender = {_id: req.user._id}
    return this.deliveryService.create(delivery)
  }

  @Get()
  @Roles(Role.User)
  async getDeliveries(@Request() req){
    return await this.deliveryService.findDeliveriesForUser(req.user._id)
  }

  @Post()
  cancelDelivery() {}
  confirmDelivery() {}
  reportIncident() {}
  markDelivered() {}
  markReturned() {}
}
