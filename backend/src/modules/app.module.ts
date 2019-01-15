import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { GraphQLModule, GraphQLFactory } from '@nestjs/graphql';
import { graphqlExpress } from 'apollo-server-express';
import * as GraphQLJSON from 'graphql-type-json';
import { apolloUploadExpress } from 'apollo-upload-server';
import { GraphQLUpload } from 'apollo-upload-server';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from '../shared/config.service';
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { SearchModule } from './search/search.module';
import { EventsModule } from "./events/events.module";
import { MoviesModule } from "./movies/movies.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AuthModule,
    UsersModule,
    SearchModule,
    EventsModule,
    MoviesModule,
    GraphQLModule
  ],
  providers: [
    { provide: ConfigService, useValue: new ConfigService() }
  ]
})
export class AppModule implements NestModule {
  constructor(private readonly graphQLFactory: GraphQLFactory) { }

  configure(consumer: MiddlewareConsumer) {
    const schema = this.createSchema();

    consumer
      .apply((req, res, next) => {
        graphqlExpress((req, res) => {
          return {
            schema,
            rootValue: req
          };
        })(req, res, next);
      })
      .forRoutes('/graphql');
    consumer.apply(apolloUploadExpress()).forRoutes('/graphql');
  }

  createSchema() {
    const typeDefs = this.graphQLFactory.mergeTypesByPaths('./**/*.graphql');
    const schema = this.graphQLFactory.createSchema({
      typeDefs,
      resolvers: {
        JSON: GraphQLJSON,
        Upload: GraphQLUpload
      }
    });
    return schema;
  }
}
