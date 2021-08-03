import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CountryDataService } from './country.data.service'
import { Country, CountrySchema } from './country.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Country.name, schema: CountrySchema }
    ])
  ],
  providers: [CountryDataService],
  exports: [CountryDataService]
})
export class CountryDataModule {}