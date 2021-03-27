import { Module } from '@nestjs/common'
import { AuthModule } from 'src/auth/auth.module'
import { AddressDataModule } from 'src/data/addressdata/address.data.module'
import { PhotoDataModule } from 'src/data/photo/photo.data.module'
import { UserDataModule } from 'src/data/userdata/user.data.module'
import { UserController } from './user.controller'

@Module({
  imports: [UserDataModule, AuthModule, AddressDataModule, PhotoDataModule],
  controllers: [UserController],
})
export class UserEndpointModule {}
