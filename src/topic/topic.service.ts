import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import { TopicsR0 } from './topic.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, UpdateResult } from 'typeorm';
import { TopicEntity } from './topic.entity';
import { validate } from 'class-validator';
import { CreateTopicDto } from './dto';
@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(TopicEntity)
    private readonly topicRepository: Repository<TopicEntity>
  ) {}
  async findAll(perPage: number, page: number, q: string): Promise<TopicsR0> {
    const [data, count] = await this.topicRepository.findAndCount({
      take: perPage,
      skip: page * perPage,
      where: {
        name: Like(`%${q}%`)
      },
      cache: true
    });
    return { data, count };
  }

  async findById(id: number): Promise<TopicEntity> {
    return await this.topicRepository.findOne({ id });
  }

  async create(body: CreateTopicDto): Promise<TopicEntity> {
    const existedTopic = await this.topicRepository.findOne({
      name: body.name
    });
    if (existedTopic) {
      throw new HttpException('话题已存在！', HttpStatus.CONFLICT);
    }
    let newTopic = new TopicEntity();
    newTopic.name = body.name;
    newTopic.avatar = body.avatar;
    newTopic.intro = body.intro;
    const errors = await validate(newTopic);
    if (errors.length) {
      throw new BadRequestException('请求参数错误！');
    } else {
      return await this.topicRepository.save(newTopic);
    }
  }

  async update(id: number, body: CreateTopicDto): Promise<TopicEntity> {
    await this.topicRepository.update(id, body);
    // {
    //   "generatedMaps": [],
    //   "raw": {
    //       "fieldCount": 0,
    //       "affectedRows": 1,
    //       "insertId": 0,
    //       "serverStatus": 2,
    //       "warningCount": 0,
    //       "message": "(Rows matched: 1  Changed: 1  Warnings: 0",
    //       "protocol41": true,
    //       "changedRows": 1
    //   }
    // }
    return { id, ...body };
  }
}
