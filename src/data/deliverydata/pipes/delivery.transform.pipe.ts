import { Injectable, PipeTransform } from "@nestjs/common";
import { DeliveryDso, DeliveryDto } from "../delivery.dto";

@Injectable()
export class DeliveryTransformPipe implements PipeTransform {
  transform(value: DeliveryDto): DeliveryDso {
    return DeliveryDso.fromDto(value)
  }
}