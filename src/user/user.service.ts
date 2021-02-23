import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserDto } from './user.dto'
import { User, UserDocument } from './user.schema'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userToCreate: UserDto): Promise<User> {
    const createdUser = new this.userModel(userToCreate)
    return createdUser.save()
  }

  async findById(id: string): Promise<User> {
    return await this.userModel.findById(id)
  }

  async findByEmail(email: string, withPassword = false): Promise<User> {
    if (withPassword) {
      return this.userModel.findOne({ email: email }).select('+password')
    } else {
      return this.userModel.findOne({ email: email })
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec()
  }
}
