import { Injectable } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import { AppConfigService } from 'src/appconfig/app.config.service'
import { v4 as uuid } from 'uuid'
import { CloudStorageObject } from '../models/cloud-storage-object'

@Injectable()
export class CloudStorageService {
  constructor(
    private appConfig: AppConfigService) {}

  async uploadPublicFile(data: Buffer, filename: string): Promise<string> {
    const s3 = new S3()
    const uploadResult = await s3.upload({
      Bucket: this.appConfig.publicS3Bucket,
      Body: data,
      Key: uuid(),
    }).promise()
    return uploadResult.Key
  }

  async deletePublicFile(key: string) {
    const s3 = new S3()
    return await s3.deleteObject({
      Bucket: this.appConfig.publicS3Bucket,
      Key: key,
    }).promise()
  }

  async getSignedUrlForObject(obj: CloudStorageObject) {
    const s3 = new S3()
    const url = await s3.getSignedUrlPromise('getObject', {
      Bucket: this.appConfig.publicS3Bucket,
      Key: obj.key
    })
    obj.url = url
    console.log(' returning ', obj)
    return obj
  }

  async getSignedUrl(key: string) {
    const s3 = new S3()
    return s3.getSignedUrlPromise('getObject', {
      Bucket: this.appConfig.publicS3Bucket,
      Key: key,
    })
  }
}
