import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose';
import { Identity, IdentitySchema } from './identity.schema';
import { IdentityDataService } from './identity.data.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Identity.name, schema: IdentitySchema }
    ])
  ],
  providers: [IdentityDataService],
  exports: [IdentityDataService],
})
export class IdentityDataModule {}
