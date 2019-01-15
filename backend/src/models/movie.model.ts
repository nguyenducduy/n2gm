import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BeforeInsert,
    BeforeUpdate,
    JoinTable,
    ManyToMany,
    OneToMany,
    BaseEntity
} from 'typeorm';
import { IsNotEmpty, validate } from "class-validator";
import { ValidateException } from '../shared/filters/validate.exception';
import { Actor, Genre } from '.';

@Entity({ name: 'movie' })
export class Movie extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'm_id' })
    id: number = 0;

    @Column({ name: 'm_title' })
    @IsNotEmpty()
    title: string = '';

    @Column({ name: 'm_slug' })
    slug: string = '';

    @Column({ name: 'm_overview' })
    overview: string = '';

    @Column({ name: 'm_seo_description' })
    seoDescription: string = '';

    @Column({ name: 'm_seo_keyword' })
    seoKeyword: string = '';

    @Column({ name: 'm_status' })
    status: number = 0;

    @Column({ name: 'm_rating' })
    rating: number = 0;

    @Column({ name: 'm_country' })
    country: number = 0;

    @Column({ name: 'm_runtime' })
    runtime: number = 0;

    @Column({ name: 'm_director' })
    director: string = '';

    @Column({ name: 'm_imdb_id' })
    imdbId: number = 0;

    @Column({ name: 'm_tmdb_id' })
    tmdbId: number = 0;

    @Column({ name: 'm_cover' })
    cover: string = '';

    @Column({ name: 'm_date_released' })
    dateReleased: number = 0;

    @Column({ name: 'm_date_created' })
    dateCreated: number = 0;

    @Column({ name: 'm_date_modified' })
    dateModified: number = 0;

    @ManyToMany(type => Actor, { cascade: ['remove'] })
    @JoinTable({
        name: 'rel_movie_actor',
        joinColumn: {
            name: 'm_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'a_id',
            referencedColumnName: 'id'
        }
    })
    actors: Actor[];

    @ManyToMany(type => Genre, { cascade: ['remove'] })
    @JoinTable({
        name: 'rel_movie_genre',
        joinColumn: {
            name: 'm_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'g_id',
            referencedColumnName: 'id'
        }
    })
    genres: Genre[];

    public static STATUS_ACTIVE: number = 1;
    public static STATUS_BLOCKED: number = 3;

    @BeforeInsert()
    private async doBeforeInsertion() {
        this.dateCreated = Math.floor(Date.now() / 1000);

        const errors = await validate(this, {
            validationError: { target: true }
        });
        if (errors.length > 0) {
            throw new ValidateException(errors);
        }
    }

    @BeforeUpdate()
    private async doBeforeUpdate() {
        this.dateModified = Math.floor(Date.now() / 1000);

        const errors = await validate(this, {
            validationError: { target: false },
            skipMissingProperties: true
        });
        if (errors.length > 0) {
            throw new ValidateException(errors);
        }
    }

    public static getStatusList() {
        return [
            { name: 'Active', value: Movie.STATUS_ACTIVE },
            { name: 'Blocked', value: Movie.STATUS_BLOCKED },
        ];
    }

    public getStatusName() {
        let name: string = "";

        switch (this.status) {
            case Movie.STATUS_ACTIVE:
                name = "Active";
                break;
            case Movie.STATUS_BLOCKED:
                name = "Blocked";
                break;
        }

        return name;
    }

    public getStatusStyle() {
        let style: string = '';

        switch (this.status) {
            case Movie.STATUS_ACTIVE:
                style = "success";
                break;
            case Movie.STATUS_BLOCKED:
                style = "danger";
                break;
        }

        return style;
    }
}
