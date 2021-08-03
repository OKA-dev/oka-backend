import { Module } from '@nestjs/common'
import { CountryDataModule } from 'src/data/countrydata/country.data.module';
import { CountryController } from './country.controller';

@Module({
  imports: [CountryDataModule],
  controllers: [CountryController],
})
export class CountryEndpointModule {}
