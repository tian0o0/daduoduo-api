import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode
} from '@nestjs/common';
import { QuestionEntity } from './question.entity';
import { QuestionService } from './question.service';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { QuestionR0 } from './question.interface';
import { CreateQuestionDto, UpdateQuestionDto } from './dto';

@ApiBearerAuth()
@ApiUseTags('questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}
  // 获取问题列表
  @Get()
  async findAll(@Query() query): Promise<QuestionR0> {
    const { perPage = 10, page = 1, q = '' } = query;
    const _perPage = Math.max(perPage * 1, 1);
    const _page = Math.max(page * 1, 1) - 1;
    return await this.questionService.findAll(_perPage, _page, q);
  }

  //获取指定问题
  @Get(':id')
  async findById(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<QuestionEntity> {
    return await this.questionService.findById(id);
  }

  // 新建问题
  @Post()
  async create(@Body() body: CreateQuestionDto): Promise<QuestionEntity> {
    return await this.questionService.create(body);
  }

  // 修改问题
  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: UpdateQuestionDto
  ): Promise<QuestionEntity> {
    return await this.questionService.update(id, body);
  }

  // 删除问题
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    return await this.questionService.delete(id);
  }
}
