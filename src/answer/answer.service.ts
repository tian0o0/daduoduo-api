import { Injectable, Scope, Inject } from '@nestjs/common';
import { CreateAnswerDto } from './dto';
import { AnswerEntity } from './answer.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionEntity } from '../question/question.entity';
import { Repository, Like, getRepository } from 'typeorm';
import { AnswerR0, OrderBy } from './answer.interface';

@Injectable({ scope: Scope.REQUEST })
export class AnswerService {
  constructor(
    @InjectRepository(AnswerEntity)
    private readonly answerRepository: Repository<AnswerEntity>,
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
    @Inject(REQUEST)
    private readonly req: Request
  ) {}

  async findAll(
    perPage: number,
    page: number,
    q: string,
    orderBy: OrderBy,
    questionId: number
  ): Promise<AnswerR0> {
    // const [data, count] = await this.answerRepository.findAndCount({
    //   take: perPage,
    //   skip: page * perPage,
    //   where: {
    //     content: Like(`%${q}%`),
    //     question: questionId
    //   },
    //   order: {
    //     voteCount: 'DESC'
    //   }
    // });
    const [data, count] = await getRepository(AnswerEntity)
      .createQueryBuilder('answer')
      .take(perPage)
      .skip(page * perPage)
      .where('answer.question = :questionId', { questionId })
      .andWhere('answer.content like :content', { content: `%${q}%` })
      .orderBy(`answer.${orderBy}`)
      .getManyAndCount();
    return { data, count };
  }

  async findById(answerId: number): Promise<AnswerEntity> {
    return await this.answerRepository.findOne(answerId, {
      relations: ['question']
    });
  }

  async create(
    questionId: number,
    { content }: CreateAnswerDto
  ): Promise<AnswerEntity> {
    let newAnswer = new AnswerEntity();
    newAnswer.content = content;
    newAnswer.answerer = this.req.user;
    newAnswer.question = await this.questionRepository.findOne(questionId);
    return await this.answerRepository.save(newAnswer);
  }

  async update(answerId: number, body: CreateAnswerDto): Promise<AnswerEntity> {
    await this.answerRepository.update(answerId, body);
    return await this.answerRepository.findOne(answerId);
  }

  async delete(answerId: number): Promise<void> {
    await this.answerRepository.delete(answerId);
  }
}
