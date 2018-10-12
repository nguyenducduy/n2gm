import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { ConfigService } from '../../shared/config.service';
import { AuthResolver } from './auth.resolver';
import { TokenService } from './token.service';
import { User } from "../../models";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([User])],
    exports: [AuthService, TokenService],
    providers: [
        AuthService,
        TokenService,
        AuthResolver,
        { provide: ConfigService, useValue: new ConfigService() }
    ]
})
export class AuthModule {}
