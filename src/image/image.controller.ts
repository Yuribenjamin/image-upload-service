import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import * as multer from 'multer';
import { AwsService } from '../aws/aws.service';

class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

const MAX_FILE_SIZE = 1.8 * 1024 * 1024;

@ApiTags('images')
@Controller('images')
export class ImageController {
  constructor(private readonly awsService: AwsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
      fileFilter: (_, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Invalid file type'), false);
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiOperation({ summary: 'Upload image' })
  @ApiResponse({ status: 200, description: 'Image successfully uploaded.' })
  async uploadFile(@UploadedFile() file) {
    try {
      console.log(file);
      const url = await this.awsService.uploadFile(file, 'images');
      return { message: 'Image successfully uploaded.', url };
    } catch (error) {
      throw new HttpException('Error uploading image.', 500);
    }
  }
}
