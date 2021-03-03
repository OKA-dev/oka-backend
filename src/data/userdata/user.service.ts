import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserDto } from './user.dto'
import { User, UserDocument } from './user.schema'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  async create(userToCreate: UserDto): Promise<User> {
    const createdUser = new this.model(userToCreate)
    return createdUser.save()
  }

  async findById(id: string): Promise<User> {
    return await this.model.findById(id)
  }

  async findByEmail(email: string, withPassword = false): Promise<User> {
    if (withPassword) {
      return this.model.findOne({ email: email }).select('+password')
    } else {
      return this.model.findOne({ email: email })
    }
  }

  async findAll(): Promise<User[]> {
    return this.model.find().exec()
  }
}
