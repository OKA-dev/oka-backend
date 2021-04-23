import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Point } from 'src/common/models/geojson'
import { Role } from 'src/common/role.enum'
import { CloudStorageService } from 'src/common/services/cloud-storage.service'
import { TimedLocation } from '../addressdata/location.types'
import { Photo } from '../photo/photo.schema'
import { UserDto } from './user.dto'
import { User, UserDocument } from './user.schema'

@Injectable()
export class UserDataService {
  constructor(
    @InjectModel(User.name) private model: Model<UserDocument>,
    private cloudStorage: CloudStorageService) {}

  async create(userToCreate: UserDto): Promise<User> {
    const createdUser = new this.model(userToCreate)
    return await createdUser.save()
  }

  async findById(id: string): Promise<User> {
    return await this.model.findById(id).populate('photo')
  }

  async findByEmail(email: string, withPassword = false): Promise<User> {
    if (withPassword) {
      return await this.model.findOne({ email: email }).select('+password')
    } else {
      return await this.model.findOne({ email: email })
    }
  }

  async findByPhoneE164(phone: string) {
    return await this.model.findOne({'phone.e164': phone})
  }

  async findByCountryCodeAndPhone(countryCode: string, phoneNumber: string) {
    return await this.model.findOne({
      'phone.countryCode': countryCode,
      'phone.number': phoneNumber
    })
  }

  async setPhoto(userId: string, photoId: string) {
    return await this.model.findOneAndUpdate(
      { _id: userId }, 
      { $set: { photo: photoId as unknown as Photo } }, 
      { new: true }
      )
  }

  async setRefreshToken(userId: string, refreshToken: string) {
    return await this.model.findOneAndUpdate(
      {_id: userId},
      { $set: {hashedRefreshToken: refreshToken }}
    )
  }

  async removeRefreshToken(userId: string) {
    return await this.model.findOneAndUpdate(
      {_id: userId},
      { $set: {hashedRefreshToken: null }}
    ) 
  }

  async findRefreshToken(userId: string) {
    return await this.model.findById(userId).select('+hashedRefreshToken')
  }

  async setLocation(userId: string, location: TimedLocation) {
    return await this.model.findOneAndUpdate(
      {_id: userId},
      {$set: {lastKnownLocation: location}},
      { new: true }
    )
  }
  async withPhotoUrls(user: User) {
    if (user.photo) {
      const url = await this.cloudStorage.getSignedUrl(user.photo.key)
      user.photo.url = url
      return user
    } else {
      console.log('returning original user')
      return user
    }
  }

  /**
   * 
   * @param point GeoJSON location to find users close to
   * @param maxDistance Maximum distance in meters to search.
   */
  async nearestUsers(point: Point, maxDistance: number) {
    return await this.model.find({
        'lastKnownLocation.geolocation': {
          $nearSphere: {
            $geometry: {
              point
            },
            maxDistance: maxDistance,
          }
        }
    })
  }

  async nearestRiders(point: Point, maxDistance: number, lastUpdated: number): Promise<User[]> {
    // Criteria
    // - lastKnownLocation.geolocation - near package.start
    // - lastKnownLocation.time >= now - 10 minutes
    let now = new Date()
    return await this.model.find({
      'lastKnownLocation.geolocation': {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: point.coordinates,
          },
          $maxDistance: maxDistance
        }
      },
      'lastKnownLocation.time': {
        $gte: new Date(now.getTime() - 1000 * 60 * lastUpdated)
      },
      'roles': Role.Rider
    })
  }

}
