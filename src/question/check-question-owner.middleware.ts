import { ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function CheckQuestionOwnerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // req.user is set in auth.middleware
  // req.question is set in check-question-exist.middleware
  if (req.user.id === req.question.questioner.id) {
    next();
  } else {
    throw new ForbiddenException('你不是问题创建者，没有权限');
  }
}
