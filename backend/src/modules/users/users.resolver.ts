import { UseInterceptors, UseGuards } from "@nestjs/common";
import { Query, Mutation, Resolver, ResolveProperty } from "@nestjs/graphql";
import { RavenInterceptor } from "nest-raven";
import { AuthGuard } from "../../guards/auth.guard";
import { Roles } from "../../decorators/roles.decorator";
import { Permissions } from "../../decorators/permissions.decorator";
import { UsersService } from "./users.service";
import { SearchService } from "../search/search.service";
import { GroupsService } from "../users/groups.service";
import { PermissionsService } from "../users/permissions.service";
import { User, Group, Permission } from "../../models";
import { plainToClass } from "class-transformer";
import * as bodybuilder from 'bodybuilder';
import { UserInterceptor } from "../../interceptors/user.interceptor";

import * as shortid from "shortid";
import * as fs from "fs";
import * as mkdirp from "mkdirp";

@Resolver("User")
@UseGuards(AuthGuard)
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService,
        private readonly groupsService: GroupsService,
        private readonly permissionsService: PermissionsService,
        private readonly searchService: SearchService
    ) {}

    @Query("getUsers")
    @Roles("isSuperUser")
    @Permissions("get.users")
    @UseInterceptors(new UserInterceptor())
    async getUsers(_: any, { opts }) {
        try {
            const myUsers = await this.usersService.findAll({
                curPage: opts.curPage,
                perPage: opts.perPage,
                q: opts.q,
                sort: opts.sort,
                groups: opts.groups,
                status: opts.status,
                verifyType: opts.verifyType,
                isSuperUser: opts.isSuperUser,
                isStaff: opts.isStaff,
                isVerified: opts.isVerified
            });
            return {
                users: plainToClass(User, myUsers.items),
                meta: myUsers.meta
            };
        } catch (error) {
            throw error;
        }
    }

    @Query("getUser")
    @Roles("isSuperUser")
    @Permissions("get.user")
    @UseInterceptors(new UserInterceptor())
    async getUser(_: any, { id }) {
        try {
            const myUser = await this.usersService.findOne(id);
            return plainToClass(User, myUser);
        } catch (error) {
            throw error;
        }
    }

    @Mutation("bulkUsers")
    @Roles("isSuperUser")
    @Permissions("bulk.users")
    async bulkUsers(_: any, { input }) {
        try {
            return await this.usersService.bulk({
                items: input.itemSelected,
                action: input.actionSelected
            });
        } catch (error) {
            throw error;
        }
    }

    @Mutation("addUser")
    @Roles("isSuperUser")
    @Permissions("add.user")
    // @UseInterceptors(RavenInterceptor())
    @UseInterceptors(new UserInterceptor())
    async addUser(_: any, { input }) {
        try {
            return await this.usersService.add(input);
        } catch (error) {
            throw error;
        }
    }

    @Mutation("updateUser")
    @Roles("isSuperUser")
    @Permissions("update.user")
    @UseInterceptors(new UserInterceptor())
    async updateUser(_: any, { id, input }) {
        try {
            return await this.usersService.update(id, input);
        } catch (error) {
            throw error;
        }
    }

    @Mutation("deleteUser")
    @Roles("isSuperUser")
    @Permissions("delete.user")
    async deleteUser(_: any, { id }) {
        try {
            return await this.usersService.delete(id);
        } catch (error) {
            throw error;
        }
    }

    @Query("getFormsource")
    @Roles("isSuperUser")
    @Permissions("formsource.user")
    async getFormsource() {
        try {
            return await this.usersService.formsource();
        } catch (error) {
            throw error;
        }
    }

    @Query("searchUsers")
    @Roles("isSuperUser", "isStaff")
    @Permissions("delete.user")
    async searchUsers(_: any, { q }) {
        try {
            let queryBuilder = bodybuilder()
                .query(
                    'multi_match',
                    'fields',
                    [ 'u_full_name', 'u_email', 'u_screen_name'],
                    {
                        query: q.trim(),
                        fuzziness: "AUTO",
                        prefix_length: 0
                    }
                )
                .size(10);

            const searchResults = await this.searchService.search({
                index: 'user',
                body: queryBuilder.build()
            });

            if (searchResults.hits.total > 0) {
                return {
                    users: searchResults.hits.hits.map(res => {
                        return {
                            id: res._source.u_id,
                            email: res._source.u_email,
                            fullName: res._source.u_full_name,
                        };
                    })
                };
            }
        } catch (error) {
            throw error;
        }
    }

    @Mutation("uploadAvatar")
    async uploadAvatar(_: any, { file }) {
        const { stream, filename, mimetype, encoding } = await file;
        console.dir(file);
        const uploadDir = `${process.cwd()}/src/storage`;
        const id = shortid.generate();
        const path = `${uploadDir}/${id}-${filename}`;
        return new Promise((resolve, reject) =>
            stream
                .on("error", error => {
                    if (stream.truncated)
                        // Delete the truncated file
                        fs.unlinkSync(path);
                    reject(error);
                })
                .pipe(fs.createWriteStream(path))
                .on("error", error => reject(error))
                .on("finish", () => resolve({ id, path }))
        );
    }

    @Query("getGroups")
    @Roles("isSuperUser")
    @Permissions("get.groups")
    async getGroups(_: any, { opts }) {
        try {
            const myGroups = await this.groupsService.findAll({
                curPage: opts.curPage,
                perPage: opts.perPage,
                q: opts.q,
                status: opts.status
            });
            return {
                groups: plainToClass(Group, myGroups.items),
                meta: myGroups.meta
            };
        } catch (error) {
            throw error;
        }
    }

    @Mutation("addGroup")
    @Roles("isSuperUser")
    @Permissions("add.group")
    async addGroup(_: any, { input }) {
        try {
            return await this.groupsService.add(input);
        } catch (error) {
            throw error;
        }
    }

    @Mutation("updateGroup")
    @Roles("isSuperUser")
    @Permissions("update.group")
    async updateGroup(_: any, { id, input }) {
        try {
            return await this.groupsService.update(id, input);
        } catch (error) {
            throw error;
        }
    }

    @Query("getPermissions")
    @Roles("isSuperUser")
    @Permissions("get.permissions")
    async getPermissions(_: any, { opts }) {
        try {
            const myPermissions = await this.permissionsService.findAll({
                curPage: opts.curPage,
                perPage: opts.perPage,
                q: opts.q
            });
            return {
                permissions: plainToClass(Permission, myPermissions.items),
                meta: myPermissions.meta
            };
        } catch (error) {
            throw error;
        }
    }

    @Mutation("addPermission")
    @Roles("isSuperUser")
    @Permissions("add.permission")
    async addPermission(_: any, { input }) {
        try {
            const myPermission = await this.permissionsService.add(input);
            this.groupsService.fullLoadAll();

            return await this.permissionsService.findOne(myPermission.id);
        } catch (error) {
            throw error;
        }
    }

    @Mutation("deletePermission")
    @Roles("isSuperUser")
    @Permissions("delete.permission")
    async deletePermission(_: any, { id }) {
        try {
            return await this.permissionsService.delete(id);
        } catch (error) {
            throw error;
        }
    }
}
