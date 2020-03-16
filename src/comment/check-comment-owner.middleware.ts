import { ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function CheckCommentOwnerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // req.user is set in auth.middleware
  // req.comment is set in check-comment-exist.middleware
  if (req.user.id === req.comment.commentator.id) {
    next();
  } else {
    throw new ForbiddenException('你不是评论创建者，没有权限');
  }
}
