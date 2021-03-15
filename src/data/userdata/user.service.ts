import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CloudStorageService } from 'src/common/services/cloud-storage.service'
import { Photo } from '../photo/photo.schema'
import { UserDto } from './user.dto'
import { User, UserDocument } from './user.schema'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private model: Model<UserDocument>,
    private cloudStorage: CloudStorageService) {}

  async create(userToCreate: UserDto): Promise<User> {
    const createdUser = new this.model(userToCreate)
    return createdUser.save()
  }

  async findById(id: string): Promise<User> {
    return await this.model.findById(id).populate('photo')
  }

  async findByEmail(email: string, withPassword = false): Promise<User> {
    if (withPassword) {
      return this.model.findOne({ email: email }).select('+password')
    } else {
      return this.model.findOne({ email: email })
    }
  }

  async setPhoto(userId: string, photoId: string) {
    return await this.model.findOneAndUpdate(
      { _id: userId }, 
      { $set: { photo: photoId as unknown as Photo } }, 
      { new: true }
      )
  }

  async findAll(): Promise<User[]> {
    return this.model.find().exec()
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
