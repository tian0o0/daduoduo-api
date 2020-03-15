import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { AnswerService } from './answer.service';

@Injectable()
export class CheckAnswerExistMiddleware implements NestMiddleware {
  constructor(private readonly answerService: AnswerService) {}
  async use(req: any, res: any, next: () => void) {
    const answer = await this.answerService.findById(req.params.id);
    if (!answer) {
      throw new NotFoundException('答案不存在');
    }

    // 👍与👎的时候不校验下面这一行，因为没有req.params.questionId
    if (
      req.params.questionId &&
      answer.question.id !== Number(req.params.questionId)
    ) {
      throw new NotFoundException('该问题下没有这个答案');
    }
    req.answer = answer;
    next();
  }
}
