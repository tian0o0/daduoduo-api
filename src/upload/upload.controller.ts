import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { UploadResult } from './upload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
@ApiBearerAuth()
@ApiUseTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ title: '七牛云上传文件' })
  @Post()
  @UseInterceptors(FileInterceptor('file', { preservePath: true }))
  async upload(@UploadedFile() file): Promise<UploadResult> {
    console.log(file);
    return await this.uploadService.upload(file);
  }
}
