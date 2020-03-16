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
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUseTags
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CommentR0 } from './comment.interface';
import { CommentEntity } from './comment.entity';
import { CreateCommentDto, UpdateCommentDto } from './dto';

@ApiBearerAuth()
@ApiUseTags('comments')
@Controller('questions/:questionId/answers/:answerId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ title: '获取某答案下的评论列表' })
  @ApiResponse({ status: 404, description: '问题/答案不存在' })
  @Get()
  async findAll(@Param() params, @Query() query): Promise<CommentR0> {
    const { perPage = 10, page = 1, q = '', rootCommentId = null } = query;
    const _perPage = Math.max(perPage * 1, 1);
    const _page = Math.max(page * 1, 1) - 1;
    return await this.commentService.findAll(
      _perPage,
      _page,
      q,
      params.questionId,
      params.answerId,
      rootCommentId
    );
  }

  @ApiOperation({ title: '获取某答案下的某个评论' })
  @ApiResponse({ status: 404, description: '问题/答案/评论不存在' })
  @Get(':id')
  async findById(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<CommentEntity> {
    return await this.commentService.findById(id);
  }

  @ApiOperation({ title: '添加评论' })
  @ApiResponse({ status: 200, description: '添加成功' })
  @ApiResponse({ status: 401, description: '请登录' })
  @Post()
  async create(
    @Param('questionId') questionId: number,
    @Param('answerId') answerId: number,
    @Body() body: CreateCommentDto
  ): Promise<CommentEntity> {
    return await this.commentService.create(questionId, answerId, body);
  }

  @ApiOperation({ title: '编辑评论' })
  @ApiResponse({ status: 200, description: '编辑成功' })
  @ApiResponse({ status: 401, description: '请登录' })
  @ApiResponse({ status: 404, description: '问题/答案/评论不存在' })
  @ApiResponse({ status: 403, description: '不是评论创建者，没有权限' })
  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: UpdateCommentDto
  ): Promise<CommentEntity> {
    return await this.commentService.update(id, body);
  }

  @ApiOperation({ title: '删除评论' })
  @ApiResponse({ status: 204, description: '删除成功' })
  @ApiResponse({ status: 401, description: '请登录' })
  @ApiResponse({ status: 404, description: '问题/答案/评论不存在' })
  @ApiResponse({ status: 403, description: '不是评论创建者，没有权限' })
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    return await this.commentService.delete(id);
  }
}
