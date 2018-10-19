import { Injectable, BadRequestException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User, Group } from "../../models";
import { UserException } from "../../shared/filters/user.exception";
import { plainToClass } from 'class-transformer';
import { ValidateException } from "../../shared/filters/validate.exception";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Group) private readonly groupRepository: Repository<Group>
    ) {}

    async findAll(options: {
        curPage: number;
        perPage: number;
        q?: string;
        group?: number;
        sort?: string;
        cache?: boolean
    }) {
        try {
            let objects: [User[], number];
            let qb = this.userRepository.createQueryBuilder("user");

            if (options.q) {
                qb = qb.where("user.fullName like :q or user.email like :q or user.id = :id", {
                    q: `%${options.q}%`,
                    id: options.q
                });
            }

            // sort
            options.sort =
                options.sort && new User().hasOwnProperty(options.sort.replace("-", "")) ? options.sort : "-id";
            const field = options.sort.replace("-", "");
            if (options.sort) {
                if (options.sort[0] === "-") {
                    qb = qb.addOrderBy("user." + field, "DESC");
                } else {
                    qb = qb.addOrderBy("user." + field, "ASC");
                }
            }

            // offset & limit
            qb = qb.skip((options.curPage - 1) * options.perPage).take(options.perPage);

            // caching
            if (options.cache) {
                qb.cache("users_admin", 60000); // 60 sec
            }

            // run query
            objects = await qb.getManyAndCount();

            return {
                users: objects[0],
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
            return await this.userRepository.findOneOrFail(id);
        } catch (error) {
            throw new UserException("user:notFound");
        }
    }

    async create(item: User) {
        try {
            let myGroups: Group[] = [];

            if (item.groups.length > 0) {
                await Promise.all(
                    item.groups.map(async groupId => {
                        const myGroup = await this.groupRepository.findOneOrFail(groupId);

                        myGroups.push(plainToClass(Group, myGroup));
                    })
                );

                item.groups = myGroups;
            }


            const myUser = this.userRepository.create(item);
            return await this.userRepository.save(myUser);
        } catch (error) {
            if (error instanceof ValidateException) {
                throw error;
            }

            throw new UserException("user:create:fail");
        }
    }

    async update(id: number, formData: any) {
        try {
            let myUser = await this.userRepository.findOneOrFail(id);

            myUser.fullName = formData.fullName;

            return await this.userRepository.save(myUser);
        } catch (error) {
            if (error instanceof ValidateException) {
                throw error;
            }

            throw new UserException("user:update:fail");
        }
    }

    async delete(id: number) {
        try {
            await this.userRepository.findOneOrFail(id);
            return await this.userRepository.delete(id);
        } catch (error) {
            throw new UserException("user:delete:fail");
        }
    }

    async formsource() {
        try {
            let output = {};
            output['groups'] = await this.groupRepository.find();
            output['status'] = User.getStatusList()

            return output;
        } catch (error) {
            throw new UserException("user:formsource:fail");
        }
    }
}
