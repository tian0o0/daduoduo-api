import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  Patch
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicsR0 } from './topic.interface';
import { TopicEntity } from './topic.entity';
import { CreateTopicDto } from './dto';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUseTags('topics')
@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get()
  async findAll(@Query() query): Promise<TopicsR0> {
    const { perPage = 10, page, q = '' } = query;
    const _perPage = Math.max(perPage * 1, 1);
    const _page = Math.max(page * 1, 1) - 1;
    return await this.topicService.findAll(_perPage, _page, q);
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<TopicEntity> {
    return this.topicService.findById(id);
  }

  @Post()
  async create(@Body() body): Promise<TopicEntity> {
    return await this.topicService.create(body);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() body: CreateTopicDto
  ): Promise<TopicEntity> {
    return await this.topicService.update(id, body);
  }
}
