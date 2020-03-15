import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { QuestionService } from './question.service';

@Injectable()
export class CheckQuestionExistMiddleware implements NestMiddleware {
  constructor(private readonly questionService: QuestionService) {}
  async use(req: any, res: any, next: () => void) {
    const question = await this.questionService.findById(req.params.id);
    if (!question) {
      throw new NotFoundException('问题不存在');
    }
    req.question = question;
    next();
  }
}
