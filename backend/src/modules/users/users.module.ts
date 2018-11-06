import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersResolver } from "./users.resolver";
import { User, Group, Permission } from "../../models";
import { ConfigService } from "../../shared/config.service";
import { GroupsService } from "./groups.service";
import { PermissionsService } from "./permissions.service";
import { SearchModule } from '../search/search.module';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([User, Group, Permission]),
        SearchModule
    ],
    exports: [
        UsersService,
        GroupsService,
        PermissionsService
    ],
    providers: [
        UsersService,
        UsersResolver,
        GroupsService,
        PermissionsService,
        { provide: ConfigService, useValue: new ConfigService() }
    ]
})
export class UsersModule {}
