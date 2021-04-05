import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Photo, PhotoSchema } from './photo.schema'
import { PhotoDataService } from './photo.data.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Photo.name, schema: PhotoSchema}
    ])
  ],
  providers: [PhotoDataService],
  exports: [PhotoDataService],
})
export class PhotoDataModule {}
