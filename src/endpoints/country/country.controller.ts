import { CountryDataService } from "src/data/countrydata/country.data.service";
import { ApiTags } from '@nestjs/swagger'
import { Controller, Get } from '@nestjs/common'
import { Public } from "src/auth/public";

@ApiTags('Countries')
@Controller('countries')
export class CountryController {

  constructor(
    private countryService: CountryDataService,
  ) {}

  @Get()
  @Public()
  async getAll() {
    return await this.countryService.findAll()
  }
}