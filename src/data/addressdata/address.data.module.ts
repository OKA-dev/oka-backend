import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema } from './address.schema';
import { AddressDataService } from './address.data.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Address.name, schema: AddressSchema },
    ]),
  ],
  providers: [AddressDataService],
  exports: [AddressDataService],
})
export class AddressDataModule {}
