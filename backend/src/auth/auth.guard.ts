import { AuthGuard } from "@nestjs/passport";
import { ContextType, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  getRequest(context: ExecutionContext) {
    const contextType = context.getType() as ContextType;
    return context.switchToHttp().getRequest();
  }
}
