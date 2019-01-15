import { Injectable } from "@nestjs/common";
import { Repository, getConnection } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Movie, Actor, Genre } from "../../models";
import { UserException } from "../../shared/filters/user.exception";
import { plainToClass } from 'class-transformer';
import { ValidateException } from "../../shared/filters/validate.exception";

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movie) private readonly movieRepository: Repository<Movie>,
        @InjectRepository(Actor) private readonly actorRepository: Repository<Actor>,
        @InjectRepository(Genre) private readonly genreRepository: Repository<Genre>
    ) {}

    async findAll(options: {
        curPage: number;
        perPage: number;
        q?: string;
        sort?: string;
        actors?: string;
        genres?: string;
        status?: number;
        cache?: boolean;
    }) {
        try {
            let objects: [Movie[], number];
            let qb = this.movieRepository.createQueryBuilder("movie");

            qb = qb.leftJoinAndSelect("movie.genres", "genre");

            if (options.q) {
                qb = qb.where("movie.title LIKE :q OR movie.id = :id", {
                    q: `%${options.q}%`,
                    id: options.q
                });
            }

            // filter by genre id
            if (options.genres) {
                options.genres.split(',').map((genreId, index) => {
                    let bindParam = {};
                    bindParam[`genre${index}`] = genreId;
                    qb = qb.orWhere(`genre.id = :genre${index}`, bindParam);
                });
            }

            // filter by status
            if (options.status) {
                qb = qb.andWhere('movie.status = :status', { status: options.status });
            }

            // sort
            options.sort =
                options.sort && new Movie().hasOwnProperty(options.sort.replace("-", "")) ? options.sort : "-id";
            const field = options.sort.replace("-", "");
            if (options.sort) {
                if (options.sort[0] === "-") {
                    qb = qb.addOrderBy("movie." + field, "DESC");
                } else {
                    qb = qb.addOrderBy("movie." + field, "ASC");
                }
            }

            // offset & limit
            qb = qb.skip((options.curPage - 1) * options.perPage).take(options.perPage);

            // // caching
            // if (options.cache) {
            //     qb.cache("users_admin", 60000); // 60 sec
            // }

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
            let movieIds = [];
            items.map(movie => {
                movieIds.push(movie.id)
            });

            switch (action) {
                case 'delete':
                    await queryRunner.manager.delete(Movie, movieIds);
                    await queryRunner.commitTransaction();

                    return movieIds;
                case 'active':
                    items.map(async movie => {
                        await queryRunner.manager.update(Movie, movie.id, { status: Movie.STATUS_ACTIVE });
                    });

                    await queryRunner.commitTransaction();
                    return movieIds;
                case 'block':
                    items.map(async movie => {
                        await queryRunner.manager.update(Movie, movie.id, { status: Movie.STATUS_BLOCKED });
                      });

                    await queryRunner.commitTransaction();
                    return movieIds;
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
            return await this.movieRepository.findOneOrFail({
                where: {
                    id: id
                },
                relations: ["genres"]
            });
        } catch (error) {
            throw new UserException("movie:notFound");
        }
    }

    // async add(item: User) {
    //     try {
    //         let myGroups: Group[] = [];

    //         if (item.groups.length > 0) {
    //             await Promise.all(
    //                 item.groups.map(async groupId => {
    //                     const myGroup = await this.groupRepository.findOneOrFail(groupId);

    //                     myGroups.push(plainToClass(Group, myGroup));
    //                 })
    //             );

    //             item.groups = myGroups;
    //         }

    //         item.screenName = item.fullName.toLowerCase() + '.' + Math.floor(Date.now() / 1000);
    //         item.verifyType = User.VERIFY_TYPE_EMAIL;
    //         item.isVerified = User.IS_VERIFIED;
    //         item.isProfileUpdated = User.IS_PROFILE_NOT_UPDATED;

    //         const myUser = this.userRepository.create(item);
    //         return await this.userRepository.save(myUser);
    //     } catch (error) {
    //         if (error instanceof ValidateException) {
    //             throw error;
    //         }

    //         throw new UserException("user:create:fail");
    //     }
    // }

    // async update(id: number, formData: any) {
    //     try {
    //         let myUser = await this.userRepository.findOneOrFail(id);

    //         myUser.fullName = formData.fullName;
    //         myUser.screenName = formData.screenName;
    //         myUser.status = formData.status;
    //         myUser.mobileNumber = formData.mobileNumber;
    //         myUser.isSuperUser = formData.isSuperUser;
    //         myUser.isSuperUser = formData.isSuperUser;
    //         myUser.isStaff = formData.isStaff;

    //         let myGroups: Group[] = [];
    //         if (formData.groups.length > 0) {
    //             await Promise.all(
    //                 formData.groups.map(async groupId => {
    //                     const myGroup = await this.groupRepository.findOneOrFail(groupId);

    //                     myGroups.push(plainToClass(Group, myGroup));
    //                 })
    //             );

    //             myUser.groups = myGroups;
    //         }

    //         return await this.userRepository.save(myUser);
    //     } catch (error) {
    //         if (error instanceof ValidateException) {
    //             throw error;
    //         }

    //         throw new UserException("user:update:fail");
    //     }
    // }

    async delete(id: number) {
        try {
            const myMovie = await this.movieRepository.findOneOrFail(id);
            return await this.movieRepository.remove(myMovie);
        } catch (error) {
            throw new UserException("movie:delete:fail");
        }
    }

    async formsource() {
        try {
            let output = {};
            output['genres'] = await this.genreRepository.find();
            output['status'] = Movie.getStatusList();

            return output;
        } catch (error) {
            throw new UserException("movie:formsource:fail");
        }
    }
}
