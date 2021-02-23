import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get dbUri(): string {
    return this.configService.get('DB_URI')
  }

  get jwtSecret(): string {
    return this.configService.get('JWT_SECRET')
  }
}
