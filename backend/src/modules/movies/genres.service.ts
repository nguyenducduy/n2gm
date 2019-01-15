import { Injectable } from "@nestjs/common";
import { Repository, getConnection } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Genre } from "../../models";
import { UserException } from "../../shared/filters/user.exception";
import { plainToClass } from 'class-transformer';
import { ValidateException } from "../../shared/filters/validate.exception";

@Injectable()
export class GenresService {
    constructor(
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
            let objects: [Genre[], number];
            let qb = this.genreRepository.createQueryBuilder("genre");

            if (options.q) {
                qb = qb.where("genre.name LIKE :q OR genre.id = :id", {
                    q: `%${options.q}%`,
                    id: options.q
                });
            }

            // sort
            options.sort =
                options.sort && new Genre().hasOwnProperty(options.sort.replace("-", "")) ? options.sort : "-id";
            const field = options.sort.replace("-", "");
            if (options.sort) {
                if (options.sort[0] === "-") {
                    qb = qb.addOrderBy("genre." + field, "DESC");
                } else {
                    qb = qb.addOrderBy("genre." + field, "ASC");
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
            let genreIds = [];
            items.map(genre => {
                genreIds.push(genre.id)
            });

            switch (action) {
                case 'delete':
                    await queryRunner.manager.delete(Genre, genreIds);
                    await queryRunner.commitTransaction();

                    return genreIds;
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
            return await this.genreRepository.findOneOrFail({
                where: {
                    id: id
                }
            });
        } catch (error) {
            throw new UserException("genre:notFound");
        }
    }

    async delete(id: number) {
        try {
            const myGenre = await this.genreRepository.findOneOrFail(id);
            return await this.genreRepository.remove(myGenre);
        } catch (error) {
            throw new UserException("genre:delete:fail");
        }
    }
}
