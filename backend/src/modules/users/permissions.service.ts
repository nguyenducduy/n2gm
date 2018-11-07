import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "../../models";
import { plainToClass } from "class-transformer";
import { ValidateException } from "../../shared/filters/validate.exception";
import { UserException } from "../../shared/filters/user.exception";

@Injectable()
export class PermissionsService {
    private items = [];

    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>
    ) {}

    async findAll(options: {
        curPage: number;
        perPage: number;
        q?: string;
        sort?: string;
        cache?: boolean;
    }) {
        try {
            let objects: [Permission[], number];
            let qb = this.permissionRepository.createQueryBuilder("permission");

            if (options.q) {
                qb = qb.where("permission.name LIKE :q", {
                    q: `%${options.q}%`,
                    id: options.q
                });
            }

            // sort
            options.sort =
                options.sort && new Permission().hasOwnProperty(options.sort.replace("-", "")) ? options.sort : "-id";
            const field = options.sort.replace("-", "");
            if (options.sort) {
                if (options.sort[0] === "-") {
                    qb = qb.addOrderBy("permission." + field, "DESC");
                } else {
                    qb = qb.addOrderBy("permission." + field, "ASC");
                }
            }

            // offset & limit
            qb = qb.skip((options.curPage - 1) * options.perPage).take(options.perPage);

            // caching
            if (options.cache) {
                qb.cache("permissions_admin", 60000); // 60 sec
            }

            // run query
            objects = await qb.getManyAndCount();

            return {
                items: objects[0],
                meta: {
                    curPage: options.curPage,
                    perPage: options.perPage,
                    totalPages: options.perPage > objects[1] ? 1 : Math.ceil(objects[1] / options.perPage),
                    totalResults: objects[1]
                }
            };
        } catch (error) {
            throw error;
        }
    }

    async findOne(id: number) {
        try {
            return await this.permissionRepository.findOneOrFail({
                where: {
                    id: id
                }
            });
        } catch (error) {
            throw new UserException("permission:notFound");
        }
    }

    async add(item: Permission) {
        try {
            const myPermission = this.permissionRepository.create(item);
            return await this.permissionRepository.save(myPermission);
        } catch (error) {
            if (error instanceof ValidateException) {
                throw error;
            }

            throw new UserException("permission:create:fail");
        }
    }

    async update(id: number, formData: any) {
        try {
            let myPermission = await this.permissionRepository.findOneOrFail(id);

            myPermission.name = formData.name;
            myPermission.description = formData.description;

            return await this.permissionRepository.save(myPermission);
        } catch (error) {
            if (error instanceof ValidateException) {
                throw error;
            }

            throw new UserException("permission:update:fail");
        }
    }

    async delete(id: number) {
        try {
            const myPermission = await this.permissionRepository.findOneOrFail(id);
            return await this.permissionRepository.remove(myPermission);
        } catch (error) {
            throw new UserException("permission:delete:fail");
        }
    }
}

