import { Module } from '@nestjs/common'
import { UserDataModule } from 'src/data/userdata/user.data.module'
import { AdminController } from './admin.controller'

@Module({
  imports: [UserDataModule],
  controllers: [AdminController],
})
export class AdminEndpointModule {}
