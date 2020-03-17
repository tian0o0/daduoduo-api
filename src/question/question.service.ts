import {
  Injectable,
  ConflictException,
  Scope,
  Inject,
  BadRequestException
} from '@nestjs/common';
import { QuestionEntity } from './question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { QuestionR0 } from './question.interface';
import { CreateQuestionDto, UpdateQuestionDto } from './dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { TopicEntity } from '../topic/topic.entity';
import { validate } from 'class-validator';

@Injectable({ scope: Scope.REQUEST })
export class QuestionService {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
    @InjectRepository(TopicEntity)
    private readonly topicEntity: Repository<TopicEntity>,
    @Inject(REQUEST)
    private readonly req: Request
  ) {}
  async findAll(perPage: number, page: number, q: string): Promise<QuestionR0> {
    const [data, count] = await this.questionRepository.findAndCount({
      take: perPage,
      skip: page * perPage,
      where: [{ title: Like(`%${q}%`) }, { description: Like(`%${q}%`) }],
      cache: true
    });
    return { data, count };
  }

  async findById(id: number): Promise<QuestionEntity> {
    return await this.questionRepository.findOne(id);
  }

  async create(body: CreateQuestionDto): Promise<QuestionEntity> {
    const { title, description = '', topics } = body;
    const existedQuestion = await this.questionRepository.findOne({ title });
    if (existedQuestion) {
      throw new ConflictException('问题已存在');
    }
    let newQuestion = new QuestionEntity();
    newQuestion.title = title;
    newQuestion.description = description;
    newQuestion.questioner = this.req.user;
    if (topics) {
      newQuestion.topics = await this.topicEntity.findByIds(topics);
    }
    const error = await validate(newQuestion);
    if (error.length) {
      throw new BadRequestException('参数校验失败');
    } else {
      return await this.questionRepository.save(newQuestion);
    }
  }

  async update(id: number, body: UpdateQuestionDto): Promise<QuestionEntity> {
    let toUpdate = await this.questionRepository.findOne(id);
    if (Reflect.has(body, 'topics')) {
      body.topics = await this.topicEntity.findByIds(body.topics);
    }
    let updated = Object.assign(toUpdate, body);
    return await this.questionRepository.save(updated);
  }

  async delete(id: number): Promise<void> {
    await this.questionRepository.delete(id);
  }
}
