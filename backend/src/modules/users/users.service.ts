import { Injectable } from "@nestjs/common";
import { Repository, getConnection, Brackets } from "typeorm";
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
        sort?: string;
        groups?: string;
        status?: number;
        verifyType?: number;
        isVerified?: number;
        isSuperUser?: number;
        isStaff?: number;
        cache?: boolean;
    }) {
        try {
            let objects: [User[], number];
            let qb = this.userRepository.createQueryBuilder("user");

            qb = qb.leftJoinAndSelect("user.groups", "group");

            if (options.q) {
                qb = qb.where("user.fullName LIKE :q OR user.email LIKE :q OR user.id = :id OR user.mobileNumber LIKE :q", {
                    q: `%${options.q}%`,
                    id: options.q
                });
            }

            // filter by group id
            if (options.groups) {
                options.groups.split(',').map((groupId, index) => {
                    let bindParam = {};
                    bindParam[`group${index}`] = groupId;
                    qb = qb.orWhere(`group.id = :group${index}`, bindParam);
                });
            }

            // filter by status
            if (options.status) {
                qb = qb.andWhere('user.status = :status', { status: options.status });
            }

            // filter by verify type
            if (options.verifyType) {
                qb = qb.andWhere('user.verifyType = :verifyType', { verifyType: options.verifyType });
            }

            // filter by super user role
            if (options.isSuperUser) {
                qb = qb.andWhere('user.isSuperUser = :isSuperUser', { isSuperUser: options.isSuperUser });
            }

            // filter by staff role
            if (options.isStaff) {
                qb = qb.andWhere('user.isStaff = :isStaff', { isStaff: options.isStaff });
            }

            // filter by verified
            if (options.isVerified) {
                qb = qb.andWhere('user.isVerified = :isVerified', { isVerified: options.isVerified });
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

    async bulk({ items, action }) {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            let userIds = [];
            items.map(user => {
                userIds.push(user.id)
            });

            switch (action) {
                case 'delete':
                    await queryRunner.manager.delete(User, userIds);
                    await queryRunner.commitTransaction();

                    return userIds;
                case 'active':
                    items.map(async user => {
                        await queryRunner.manager.update(User, user.id, { status: User.STATUS_ACTIVE });
                    });

                    await queryRunner.commitTransaction();
                    return userIds;
                case 'block':
                    items.map(async user => {
                        await queryRunner.manager.update(User, user.id, { status: User.STATUS_BLOCKED });
                      });

                    await queryRunner.commitTransaction();
                    return userIds;
            }
        } catch (error) {
            await queryRunner.rollbackTransaction();

            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findOne(id: number) {
        try {
            return await this.userRepository.findOneOrFail({
                where: {
                    id: id
                },
                relations: ["groups"]
            });
        } catch (error) {
            throw new UserException("user:notFound");
        }
    }

    async add(item: User) {
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

            item.screenName = item.fullName.toLowerCase() + '.' + Math.floor(Date.now() / 1000);
            item.verifyType = User.VERIFY_TYPE_EMAIL;
            item.isVerified = User.IS_VERIFIED;
            item.isProfileUpdated = User.IS_PROFILE_NOT_UPDATED;

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
            myUser.screenName = formData.screenName;
            myUser.status = formData.status;
            myUser.mobileNumber = formData.mobileNumber;
            myUser.isSuperUser = formData.isSuperUser;
            myUser.isSuperUser = formData.isSuperUser;
            myUser.isStaff = formData.isStaff;

            let myGroups: Group[] = [];
            if (formData.groups.length > 0) {
                await Promise.all(
                    formData.groups.map(async groupId => {
                        const myGroup = await this.groupRepository.findOneOrFail(groupId);

                        myGroups.push(plainToClass(Group, myGroup));
                    })
                );

                myUser.groups = myGroups;
            }

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
            const myUser = await this.userRepository.findOneOrFail(id);
            return await this.userRepository.remove(myUser);
        } catch (error) {
            throw new UserException("user:delete:fail");
        }
    }

    async formsource() {
        try {
            let output = {};
            output['groups'] = await this.groupRepository.find();
            output['status'] = User.getStatusList();
            output['verifyTypes'] = User.getVerifyTypeList();

            return output;
        } catch (error) {
            throw new UserException("user:formsource:fail");
        }
    }
}
