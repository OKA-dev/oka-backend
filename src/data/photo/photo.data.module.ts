import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Photo, PhotoSchema } from './photo.schema'
import { PhotoService } from './photo.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Photo.name, schema: PhotoSchema}
    ])
  ],
  providers: [PhotoService],
  exports: [PhotoService],
})
export class PhotoDataModule {}
