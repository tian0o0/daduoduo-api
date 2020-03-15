import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { TopicService } from './topic.service';

@Injectable()
export class CheckTopicExistMiddleware implements NestMiddleware {
  constructor(private readonly topicService: TopicService) {}

  async use(req: any, res: any, next: () => void) {
    const topic = await this.topicService.findById(req.params.id);

    if (!topic) {
      throw new NotFoundException('话题不存在');
    }
    next();
  }
}
