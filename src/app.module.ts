import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AwsService } from './aws/aws.service';
import { ImageController } from './image/image.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [ImageController],
  providers: [AwsService],
})
export class AppModule {}
