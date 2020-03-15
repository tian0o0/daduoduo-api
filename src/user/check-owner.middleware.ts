import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function CheckOwnMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // req.user is set in auth.middleware
  if (req.user.id === Number(req.params.id)) {
    next();
  } else {
    throw new ForbiddenException('没有权限');
  }
}
