import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { LatLong, Point } from '../models/geojson'

@Injectable()
export class LocationTransformPipe implements PipeTransform {
  transform(location: LatLong, metadata: ArgumentMetadata): Point {
    return new Point(location.longitude, location.latitude)
  }
}
