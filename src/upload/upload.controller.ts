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
const multer = require('multer');

const multerOpts = {
  preservePath: true,
  storage: multer.diskStorage({
    filename: function(req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  })
};

@ApiBearerAuth()
@ApiUseTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ title: '七牛云上传文件' })
  @Post()
  @UseInterceptors(FileInterceptor('file', multerOpts))
  async upload(@UploadedFile() file): Promise<UploadResult> {
    return await this.uploadService.upload(file);
  }
}
