import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    JoinColumn
} from 'typeorm';
import { IsNotEmpty, validateSync } from 'class-validator';
import { Movie } from ".";

@Entity({ name: 'genre' })
export class Genre {
    @PrimaryGeneratedColumn({ name: 'g_id' })
    id: number;

    @Column({ name: 'g_name', unique: true })
    @IsNotEmpty()
    name: string;

    @ManyToMany(type => Movie)
    @JoinTable({
        name: 'rel_movie_genre',
        joinColumn: {
            name: 'g_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'm_id',
            referencedColumnName: 'id'
        }
    })
    movies: Movie[];

    @BeforeInsert()
    doBeforeInsertion() {
        const errors = validateSync(this, {
            validationError: { target: false }
        });

        if (errors.length > 0) {
            throw errors;
        }
    }

    @BeforeUpdate()
    doBeforeUpdate() {
        const errors = validateSync(this, {
            validationError: { target: false },
            skipMissingProperties: true
        });

        if (errors.length > 0) {
            throw errors;
        }
    }
}
