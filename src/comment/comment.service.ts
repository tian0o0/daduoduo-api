import { Injectable, Scope, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { Repository, getRepository, Like } from 'typeorm';
import { CommentR0 } from './comment.interface';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { AnswerEntity } from '../answer/answer.entity';
import { QuestionEntity } from '../question/question.entity';
import { UserEntity } from '../user/user.entity';
import { CreateCommentDto, UpdateCommentDto } from './dto';

@Injectable({ scope: Scope.REQUEST })
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(AnswerEntity)
    private readonly answerRepository: Repository<AnswerEntity>,
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(REQUEST)
    private readonly req: Request
  ) {}

  async findAll(
    perPage: number,
    page: number,
    q: string,
    questionId: number,
    answerId: number,
    rootCommentId: number
  ): Promise<CommentR0> {
    const [data, count] = await this.commentRepository.findAndCount({
      take: perPage,
      skip: page * perPage,
      where: {
        content: Like(`%${q}%`),
        question: questionId,
        answer: answerId,
        rootComment: rootCommentId
      },
      relations: ['subComments']
    });
    return { data, count };
  }

  async findById(commentId: number): Promise<CommentEntity> {
    return await this.commentRepository.findOne(commentId, {
      relations: ['subComments']
    });
  }

  async create(
    questionId: number,
    answerId: number,
    body: CreateCommentDto
  ): Promise<CommentEntity> {
    const { content, rootCommentId, replyTo } = body;
    let newComment = new CommentEntity();
    newComment.content = content;
    newComment.commentator = this.req.user;
    newComment.question = await this.questionRepository.findOne(questionId);
    newComment.answer = await this.answerRepository.findOne(answerId);
    if (rootCommentId) {
      newComment.rootComment = await this.commentRepository.findOne(
        rootCommentId
      );
    }
    if (replyTo) {
      newComment.replyTo = await this.userRepository.findOne(replyTo);
    }
    return await this.commentRepository.save(newComment);
  }

  async update(
    commentId: number,
    body: UpdateCommentDto
  ): Promise<CommentEntity> {
    await this.commentRepository.update(commentId, body);
    return await this.commentRepository.findOne(commentId);
  }

  async delete(commentId: number): Promise<void> {
    await this.commentRepository.delete(commentId);
  }
}
