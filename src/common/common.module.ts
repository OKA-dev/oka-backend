import { Global, Module } from '@nestjs/common'
import { AppconfigModule } from 'src/appconfig/appconfig.module'
import { CloudStorageService } from './services/cloud-storage.service'

@Global()
@Module({
  imports: [AppconfigModule],
  providers: [CloudStorageService],
  exports: [CloudStorageService],
})
export class CommonModule {}
