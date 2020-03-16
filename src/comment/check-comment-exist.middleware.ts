import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { CommentService } from './comment.service';

@Injectable()
export class CheckCommentExistMiddleware implements NestMiddleware {
  constructor(private readonly commentService: CommentService) {}
  async use(req: any, res: any, next: () => void) {
    const comment = await this.commentService.findById(req.params.id);
    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    // 👍与👎的时候不校验下面这一行，因为没有req.params.questionId和req.params.answerId
    if (
      req.params.questionId &&
      comment.question.id !== Number(req.params.questionId)
    ) {
      throw new NotFoundException('该问题下没有这个评论');
    }
    if (
      req.params.answerId &&
      comment.answer.id !== Number(req.params.answerId)
    ) {
      throw new NotFoundException('该答案下没有这个评论');
    }
    req.comment = comment;
    next();
  }
}
