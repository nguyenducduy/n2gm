import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Group } from "../../models";
import { plainToClass } from "class-transformer";
import { ValidateException } from "../../shared/filters/validate.exception";
import { UserException } from "../../shared/filters/user.exception";

@Injectable()
export class GroupsService {
    private items = [];

    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>
    ) {
        // Load full list when start
        this.fullLoadAll();
    }

    getGroupByName(name: string) {
        let groups = this.items.filter(group => group.name === name);
        if (groups.length) {
            return groups[0];
        }

        return null;
    }

    public async fullLoadAll() {
        if (this.items.length === 0) {
            try {
                const groups = await this.groupRepository
                    .createQueryBuilder("group")
                    .leftJoinAndSelect("group.permissions", "permission")
                    .getMany();

                this.items = Object.assign(
                    this.items,
                    plainToClass(Group, groups)
                );

            } catch (error) {
                throw error;
            }
        }
    }

    async findAll(options: {
        curPage: number;
        perPage: number;
        q?: string;
        sort?: string;
        status?: number;
        cache?: boolean;
    }) {
        try {
            let objects: [Group[], number];
            let qb = this.groupRepository.createQueryBuilder("group");

            qb = qb.leftJoinAndSelect("group.permissions", "permission");

            if (options.q) {
                qb = qb.where("group.name LIKE :q OR group.screenName LIKE :q", {
                    q: `%${options.q}%`,
                    id: options.q
                });
            }

            // filter by status
            if (options.status) {
                qb = qb.andWhere('group.status = :status', { status: options.status });
            }

            // sort
            options.sort =
                options.sort && new Group().hasOwnProperty(options.sort.replace("-", "")) ? options.sort : "-id";
            const field = options.sort.replace("-", "");
            if (options.sort) {
                if (options.sort[0] === "-") {
                    qb = qb.addOrderBy("group." + field, "ASC");
                } else {
                    qb = qb.addOrderBy("group." + field, "DESC");
                }
            }

            // offset & limit
            qb = qb.skip((options.curPage - 1) * options.perPage).take(options.perPage);

            // caching
            if (options.cache) {
                qb.cache("groups_admin", 60000); // 60 sec
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
            return await this.groupRepository.findOneOrFail({
                where: {
                    id: id
                },
                relations: ["permissions"]
            });
        } catch (error) {
            throw new UserException("group:notFound");
        }
    }

    async add(item: Group) {
        try {
            const myGroup = this.groupRepository.create(item);
            return await this.groupRepository.save(myGroup);
        } catch (error) {
            if (error instanceof ValidateException) {
                throw error;
            }

            throw new UserException("group:create:fail");
        }
    }

    async update(id: number, formData: any) {
        try {
            let myGroup = await this.groupRepository.findOneOrFail(id);

            myGroup.name = formData.name;
            myGroup.screenName = formData.fullName;
            myGroup.style = formData.style;

            return await this.groupRepository.save(myGroup);
        } catch (error) {
            if (error instanceof ValidateException) {
                throw error;
            }

            throw new UserException("group:update:fail");
        }
    }

    async delete(id: number) {
        try {
            const myGroup = await this.groupRepository.findOneOrFail(id);
            return await this.groupRepository.remove(myGroup);
        } catch (error) {
            throw new UserException("group:delete:fail");
        }
    }
}
