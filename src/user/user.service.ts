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

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email })
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec()
  }
}
