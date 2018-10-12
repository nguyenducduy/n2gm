import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersResolver } from "./users.resolver";
import { User, Group } from "../../models";
import { ConfigService } from "../../shared/config.service";
import { GroupsService } from "./groups.service";
import { SearchService } from '../search/search.service';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([User, Group])
    ],
    exports: [
        UsersService,
        GroupsService,
        SearchService
    ],
    providers: [
        UsersService,
        UsersResolver,
        GroupsService,
        SearchService,
        { provide: ConfigService, useValue: new ConfigService() }
    ]
})
export class UsersModule {}
