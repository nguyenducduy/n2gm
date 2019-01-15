import { UseInterceptors, UseGuards } from "@nestjs/common";
import { Query, Mutation, Resolver, ResolveProperty } from "@nestjs/graphql";
import { RavenInterceptor } from "nest-raven";
import { AuthGuard } from "../../guards/auth.guard";
import { Roles } from "../../decorators/roles.decorator";
import { Permissions } from "../../decorators/permissions.decorator";
import { MoviesService } from "./movies.service";
import { SearchService } from "../search/search.service";
import { Movie, Actor, Genre } from "../../models";
import { plainToClass } from "class-transformer";
import * as bodybuilder from 'bodybuilder';
import { UserInterceptor } from "../../interceptors/user.interceptor";

@Resolver("Movie")
// @UseGuards(AuthGuard)
export class MoviesResolver {
    constructor(
        private readonly moviesService: MoviesService,
        // private readonly groupsService: GroupsService,
        // private readonly permissionsService: PermissionsService,
        private readonly searchService: SearchService
    ) {}

    @Query("fetchTmdb")
    // @Roles("isSuperUser")
    // @Permissions("add.user")
    // @UseInterceptors(RavenInterceptor())
    // @UseInterceptors(new UserInterceptor())
    async fetchTmdb(_: any, { input }) {
        
        
        // try {
        //     return await this.usersService.add(input);
        // } catch (error) {
        //     throw error;
        // }
    }

    // @Query("getUsers")
    // @Roles("isSuperUser")
    // @Permissions("get.users")
    // @UseInterceptors(new UserInterceptor())
    // async getUsers(_: any, { opts }) {
    //     try {
    //         const myUsers = await this.usersService.findAll({
    //             curPage: opts.curPage,
    //             perPage: opts.perPage,
    //             q: opts.q,
    //             sort: opts.sort,
    //             groups: opts.groups,
    //             status: opts.status,
    //             verifyType: opts.verifyType,
    //             isSuperUser: opts.isSuperUser,
    //             isStaff: opts.isStaff,
    //             isVerified: opts.isVerified
    //         });
    //         return {
    //             users: plainToClass(User, myUsers.items),
    //             meta: myUsers.meta
    //         };
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // @Query("getUser")
    // @Roles("isSuperUser")
    // @Permissions("get.user")
    // @UseInterceptors(new UserInterceptor())
    // async getUser(_: any, { id }) {
    //     try {
    //         const myUser = await this.usersService.findOne(id);
    //         return plainToClass(User, myUser);
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // @Mutation("bulkUsers")
    // @Roles("isSuperUser")
    // @Permissions("bulk.users")
    // async bulkUsers(_: any, { input }) {
    //     try {
    //         return await this.usersService.bulk({
    //             items: input.itemSelected,
    //             action: input.actionSelected
    //         });
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // @Mutation("addUser")
    // @Roles("isSuperUser")
    // @Permissions("add.user")
    // // @UseInterceptors(RavenInterceptor())
    // @UseInterceptors(new UserInterceptor())
    // async addUser(_: any, { input }) {
    //     try {
    //         return await this.usersService.add(input);
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // @Mutation("updateUser")
    // @Roles("isSuperUser")
    // @Permissions("update.user")
    // @UseInterceptors(new UserInterceptor())
    // async updateUser(_: any, { id, input }) {
    //     try {
    //         return await this.usersService.update(id, input);
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // @Mutation("deleteUser")
    // @Roles("isSuperUser")
    // @Permissions("delete.user")
    // async deleteUser(_: any, { id }) {
    //     try {
    //         return await this.usersService.delete(id);
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // @Query("getFormsource")
    // @Roles("isSuperUser")
    // @Permissions("formsource.user")
    // async getFormsource() {
    //     try {
    //         return await this.usersService.formsource();
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    
}
