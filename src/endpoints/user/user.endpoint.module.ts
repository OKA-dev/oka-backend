import { Module } from '@nestjs/common'
import { AddressdataModule } from 'src/data/addressdata/address.data.module'
import { UserDataModule } from 'src/data/userdata/user.data.module'
import { UserController } from './user.controller'

@Module({
  imports: [UserDataModule, AddressdataModule],
  controllers: [UserController],
})
export class UserEndpointModule {}
