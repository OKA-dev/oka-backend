import { ApiProperty } from "@nestjs/swagger"


export type NumberPair = [number, number]

enum GeoType {
  Point = 'Point',
  LineString = 'LineString',
  Polygon = 'Polygon',
  MultiPoint = 'MultiPoint',
  MultiLineString = 'MultiLineString',
  MultiPolygon = 'MultiPolygon',
}

export class Point {
  type: GeoType
  @ApiProperty({ type: [Number] })
  coordinates: NumberPair

  constructor(longitude: number, latitude: number) {
    this.type = GeoType.Point
    this.coordinates = [longitude, latitude]
  }
}

export class LineString {
  type: GeoType
  coordinates: NumberPair[]

  constructor(coordinates: NumberPair[]) {
    this.type = GeoType.LineString
    this.coordinates = coordinates
  }
}

export class Polygon {
  type: GeoType
  coordinates: NumberPair[][]

  constructor(coordinates: NumberPair[][]) {
    this.type = GeoType.Polygon
    this.coordinates = coordinates
  }
}

export const pointType = {
  type: { type: ['Point'], required: true },
  coordinates: { type: [Number], required: true },
}

export class LatLong {
  @ApiProperty()
  latitude: number
  @ApiProperty()
  longitude: number
}