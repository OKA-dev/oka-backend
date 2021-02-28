import { Point } from 'src/global/models/geojson'

export const pointType = {
  coordinates: [Number],
  type: {type: ['Point'], required: true },
}

export const timedLocationType = {
  timestamp: { type: Date, required: true, default: Date.now() },
  geolocation: { type: pointType },
}

export const phoneType = {
  number: String,
  countryCode: String,
  e164: { type: String, required: true, unique: true },
}

export class TimedLocation {
  time: Date
  geolocation: Point
}
