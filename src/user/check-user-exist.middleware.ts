import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class CheckUserExistMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: any, res: any, next: () => void) {
    const user = await this.userService.findById(req.params.id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    next();
  }
}
