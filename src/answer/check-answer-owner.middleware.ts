import { ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function CheckAnswerOwnerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // req.user is set in auth.middleware
  // req.answer is set in check-answer-exist.middleware
  console.log(req.answer);
  if (req.user.id === req.answer.answerer.id) {
    next();
  } else {
    throw new ForbiddenException('你不是回答创建者，没有权限');
  }
}
