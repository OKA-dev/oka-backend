import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
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
      {$set: {lastKnownLocation: location}}
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
}
