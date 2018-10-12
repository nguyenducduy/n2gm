import { Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver('Auth')
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Query('login')
    async login(_: any, { input }) {
        return await this.authService.login(input);
    }
}
