import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ulid } from 'ulid';
import awsConfig from '../config/aws.config';

@Injectable()
export class AwsService {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
      region: awsConfig.region,
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const ulidFileName = `${ulid()}-${file.originalname}`;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: awsConfig.bucketName,
      Key: `${folder}/${ulidFileName}`,
      Body: file.buffer,
      ACL: 'public-read',
    };

    const result = await this.s3.upload(params).promise();
    return result.Location;
  }
}
