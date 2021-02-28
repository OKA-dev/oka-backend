import { Injectable, PipeTransform } from "@nestjs/common";
import { AddressDto, AddressDso } from "../address.dto";

@Injectable()
export class AddressTransformPipe implements PipeTransform {
  transform(value: AddressDto): AddressDso {
    return AddressDso.createDso(value)
  }
}