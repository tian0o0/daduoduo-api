import {
  Get,
  Post,
  Body,
  Delete,
  Param,
  Controller,
  UsePipes,
  BadRequestException,
  Req,
  Query,
  Patch,
  Put,
  HttpCode,
  ParseIntPipe
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserData } from './user.interface';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { User } from './user.decorator';
import { ValidationPipe } from '../shared/pipes/validation.pipe';

import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { QuestionEntity } from '../question/question.entity';
import { AnswerEntity } from '../answer/answer.entity';

@ApiBearerAuth()
@ApiUseTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 获取用户列表
  @Get()
  async findAll(@Query() query): Promise<UserEntity[]> {
    const { perPage = 10, page = 1 } = query;
    const _perPage = Math.max(perPage * 1, 1);
    const _page = Math.max(page * 1, 1) - 1;
    return await this.userService.listUsers(_perPage, _page);
  }

  // 根据email查找用户
  @Get(':email')
  async findMe(@Param('email') email: string): Promise<UserData> {
    return await this.userService.findByEmail(email);
  }

  // 更新用户
  @Patch(':id')
  async update(@Param('id') userId: number, @Body() userData: UpdateUserDto) {
    return await this.userService.update(userId, userData);
  }

  // 创建新用户
  // @UsePipes(new ValidationPipe())
  // 设置了全局的验证管道，这里不需要了
  @Post()
  async create(@Body() userData: CreateUserDto) {
    return await this.userService.create(userData);
  }

  // 删除用户
  @Delete(':email')
  async delete(@Param('email') email: string) {
    return await this.userService.delete(email);
  }

  // 登录
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserData> {
    const _user = await this.userService.findOne(loginUserDto);
    if (!_user) throw new BadRequestException('邮箱或密码不正确');

    const token = await this.userService.generateJWT(_user);
    const { id, email, name, headline, avatar } = _user;
    return { id, email, token, name, headline, avatar };
  }

  // 关注列表
  @Get(':id/following')
  async listFollowing(
    @Param('id', new ParseIntPipe()) userId: number
  ): Promise<UserEntity[]> {
    return await this.userService.listFollowing(userId);
  }

  // 粉丝列表
  @Get(':id/follower')
  async listFollower(
    @Param('id', new ParseIntPipe()) userId: number
  ): Promise<UserEntity[]> {
    return await this.userService.listFollower(userId);
  }

  // 关注用户
  @Put('follow/:id')
  @HttpCode(204)
  async follow(@Param('id', new ParseIntPipe()) userId: number): Promise<void> {
    return await this.userService.follow(userId);
  }

  // 取消关注
  @Delete('unfollow/:id')
  @HttpCode(204)
  async unfollow(
    @Param('id', new ParseIntPipe()) userId: number
  ): Promise<void> {
    return await this.userService.unfollow(userId);
  }

  // 关注话题
  @Put('follow/topic/:id')
  @HttpCode(204)
  async followTopic(
    @Param('id', new ParseIntPipe()) topicId: number
  ): Promise<void> {
    return await this.userService.followTopic(topicId);
  }

  // 取消关注话题
  @Delete('unfollow/topic/:id')
  @HttpCode(204)
  async unfollowTopic(
    @Param('id', new ParseIntPipe()) topicId: number
  ): Promise<void> {
    return await this.userService.unfollowTopic(topicId);
  }

  // 用户提问列表
  @Get(':id/questions')
  async listQuestions(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<QuestionEntity[]> {
    return await this.userService.listQuestions(id);
  }

  // 赞过的答案
  @Get(':id/likedAnswers')
  async listLikedAnswers(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<AnswerEntity[]> {
    return await this.userService.listLikedAnswers(id);
  }

  // 踩过的答案
  @Get(':id/dislikedAnswers')
  async listDislikedAnswers(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<AnswerEntity[]> {
    return await this.userService.listDislikedAnswers(id);
  }

  // 赞
  @Put('likeAnswer/:id')
  @HttpCode(204)
  async likeAnswer(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    await this.userService.likeAnswer(id);
    await this.userService.cancelDislikeAnswer(id);
  }

  // 取消赞
  @Delete('likeAnswer/:id')
  @HttpCode(204)
  async cancelLikeAnswer(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<void> {
    await this.userService.cancelLikeAnswer(id);
  }

  // 踩
  @Put('dislikeAnswer/:id')
  @HttpCode(204)
  async dislikeAnswer(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<void> {
    await this.userService.dislikeAnswer(id);
    await this.userService.cancelLikeAnswer(id);
  }

  // 取消踩
  @Delete('dislikeAnswer/:id')
  @HttpCode(204)
  async cancelDislikeAnswer(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<void> {
    await this.userService.cancelDislikeAnswer(id);
  }

  // 获取收藏的答案列表
  @Get(':id/collectedAnswers')
  async listCollectedAnswers(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<AnswerEntity[]> {
    return await this.userService.listCollectedAnswers(id);
  }

  // 收藏答案
  @Put('collectAnswer/:id')
  async collectAnswer(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<void> {
    await this.userService.collectAnswer(id);
  }

  // 取消收藏答案
  @Delete('collectAnswer/:id')
  async cancelCollectAnswer(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<void> {
    await this.userService.cancelCollectAnswer(id);
  }
}
