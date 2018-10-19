import { Injectable, Inject, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserException } from '../shared/filters/user.exception';
import { User } from '../models/user.model';
import { TokenService } from '../modules/auth/token.service';
import { GroupsService } from '../modules/users/groups.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,

        @Inject('TokenService')
        private readonly tokenService: TokenService,

        @Inject('GroupsService')
        private readonly groupsService: GroupsService
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const handler = context.getHandler();

        const roles = this.reflector.get<string[]>('roles', handler);
        const permissions = this.reflector.get<string[]>('permissions', handler);

        if (req.headers.authorization
            && (req.headers.authorization as string).split(' ')[0] === 'Bearer'
            && roles && roles.length > 0
            && permissions && permissions.length > 0
        ) {
            const token = (req.headers.authorization as string).split(' ')[1];

            if (token && this.tokenService.verify(token)) {
                const data: any = this.tokenService.decode(token);
                req['user'] = plainToClass(User, data);
                req['user'].groups = data.groups.map(group =>
                    this.groupsService.getGroupByName(group.name)
                );
            }

            const hasRole = roles ? roles.filter(roleName =>
                req['user'] &&
                req['user'][roleName]
            ).length > 0 : null;

            const hasPermission = permissions ?
                req['user'] &&
                req['user'] instanceof User &&
                req['user'].checkPermissions(permissions) : null;

            if (hasRole === true && hasPermission === true) {
                return true;
            } else {
                return false;
            }
        } else {
            throw new UserException('request:unauthorized');
        }
    }
}
