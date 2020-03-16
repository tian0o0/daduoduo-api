import { Injectable } from '@nestjs/common';
import { UploadResult } from './upload.interface';
import { qiniuOptions } from '../config';
const qiniu = require('qiniu');

interface respBody {
  hash: string;
  key: string;
}

@Injectable()
export class UploadService {
  async upload(file): Promise<UploadResult> {
    return;
    try {
      const res = await this.qiniuPut(file.originalname, file.originalname);
      const url = qiniuOptions.url + res.key;
      return {
        code: 0,
        url
      };
    } catch (e) {
      console.log(e);
      return { code: -1, msg: '上传失败' };
    }
  }

  async qiniuPut(key, localFile): Promise<respBody> {
    const uploadToken = this.qiniuToken();
    const config = new qiniu.conf.Config();
    // 空间对应的机房(华南)
    config.zone = qiniu.zone.Zone_z2;
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    return new Promise((resolve, reject) => {
      formUploader.putFile(
        uploadToken,
        key,
        localFile,
        putExtra,
        (respErr, respBody, respInfo) => {
          if (respErr) {
            reject(respErr);
          } else {
            resolve(respBody);
          }
        }
      );
    });
  }

  qiniuToken(): string {
    const accessKey = '3nH2f8RtM8RODhkiOvICQAzqmumcu_paMWlrtfP6';
    const secretKey = '17zOsj5y07mCcDwalPdIznVkVaxlVscAuuUAz05V';
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = {
      scope: qiniuOptions.bucket
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    return uploadToken;
  }
}
