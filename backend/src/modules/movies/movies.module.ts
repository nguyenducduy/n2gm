import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MoviesService } from "./movies.service";
import { MoviesResolver } from "./movies.resolver";
import { Movie, Genre, Actor } from "../../models";
import { ConfigService } from "../../shared/config.service";
import { GenresService } from "./genres.service";
// import { ActorsService } from "./actors.service";
import { SearchModule } from '../search/search.module';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([
            Movie,
            Genre,
            Actor
        ]),
        SearchModule
    ],
    exports: [
        MoviesService,
        GenresService,
        // ActorsService
    ],
    providers: [
        MoviesService,
        MoviesResolver,
        GenresService,
        // ActorsService,
        { provide: ConfigService, useValue: new ConfigService() }
    ]
})
export class MoviesModule {}
