import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { TopicService } from './topic.service';

@Injectable()
export class TopicMiddleware implements NestMiddleware {
  constructor(private topicService: TopicService) {}
  async use(req: any, res: any, next: () => void) {
    const existedTopic = await this.topicService.findById(req.params.id);
    if (!existedTopic) {
      throw new NotFoundException('话题不存在');
    } else {
      next();
    }
  }
}
