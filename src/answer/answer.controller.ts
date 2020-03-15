import {
  Controller,
  Post,
  HttpCode,
  Body,
  Param,
  Get,
  Query,
  Patch,
  ParseIntPipe,
  Delete
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnswerEntity } from './answer.entity';
import { CreateAnswerDto } from './dto';
import { AnswerService } from './answer.service';
import { AnswerR0 } from './answer.interface';

@Controller('questions/:questionId/answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @ApiOperation({ title: '获取某问题下的答案列表' })
  @ApiResponse({ status: 404, description: '问题不存在' })
  @Get()
  async findAll(
    @Param('questionId') questionId: number,
    @Query() query
  ): Promise<AnswerR0> {
    const { perPage = 10, page = 1, q = '', orderBy = 'voteCount' } = query;
    const _perPage = Math.max(perPage * 1, 1);
    const _page = Math.max(page * 1, 1) - 1;
    return await this.answerService.findAll(
      _perPage,
      _page,
      q,
      orderBy,
      questionId
    );
  }

  @ApiOperation({ title: '获取某问题下的某个答案' })
  @ApiResponse({ status: 404, description: '问题/答案不存在' })
  @Get(':id')
  async findById(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<AnswerEntity> {
    return await this.answerService.findById(id);
  }

  @ApiOperation({ title: '添加答案' })
  @ApiResponse({ status: 200, description: '添加成功' })
  @ApiResponse({ status: 401, description: '请登录' })
  @Post()
  async create(
    @Param('questionId') questionId: number,
    @Body() body: CreateAnswerDto
  ): Promise<AnswerEntity> {
    return await this.answerService.create(questionId, body);
  }

  @ApiOperation({ title: '编辑答案' })
  @ApiResponse({ status: 200, description: '编辑成功' })
  @ApiResponse({ status: 401, description: '请登录' })
  @ApiResponse({ status: 404, description: '问题/答案不存在' })
  @ApiResponse({ status: 403, description: '不是答案创建者，没有权限' })
  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: CreateAnswerDto
  ): Promise<AnswerEntity> {
    return await this.answerService.update(id, body);
  }

  @ApiOperation({ title: '删除答案' })
  @ApiResponse({ status: 204, description: '删除成功' })
  @ApiResponse({ status: 401, description: '请登录' })
  @ApiResponse({ status: 404, description: '问题/答案不存在' })
  @ApiResponse({ status: 403, description: '不是答案创建者，没有权限' })
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    return await this.answerService.delete(id);
  }
}
