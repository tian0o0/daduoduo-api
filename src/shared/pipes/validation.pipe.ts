import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('缺少请求参数');
    }

    const { type, metatype, data } = metadata;
    // console.log(metadata);
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors: ValidationError[] = await validate(object);
    if (errors.length > 0) {
      throw new HttpException(
        { errors: this.buildError(errors) },
        HttpStatus.BAD_REQUEST
      );
    }
    return value;
  }

  private buildError(errors) {
    const result = {};
    errors.forEach(el => {
      let prop = el.property;
      Object.entries(el.constraints).forEach(constraint => {
        result[prop + constraint[0]] = `${constraint[1]}`;
      });
    });
    return result;
  }

  // 当验证类型不是 JavaScript 的数据类型时，跳过验证
  private toValidate(metatype): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
