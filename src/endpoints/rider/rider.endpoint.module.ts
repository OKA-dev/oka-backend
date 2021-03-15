import { Module } from '@nestjs/common';
import { AddressDataModule } from 'src/data/addressdata/address.data.module';
import { IdentityDataModule } from 'src/data/document/identity.data.module';
import { UserDataModule } from 'src/data/userdata/user.data.module';
import { RiderController } from './rider.controller';

@Module({
  controllers: [RiderController],
  imports: [UserDataModule, AddressDataModule, IdentityDataModule],
})
export class RiderEndpointModule {}
