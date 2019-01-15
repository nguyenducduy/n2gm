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

@Entity({ name: 'actor' })
export class Actor {
    @PrimaryGeneratedColumn({ name: 'a_id' })
    id: number;

    @Column({ name: 'a_name', unique: true })
    @IsNotEmpty()
    name: string;

    @ManyToMany(type => Movie)
    @JoinTable({
        name: 'rel_movie_actor',
        joinColumn: {
            name: 'a_id',
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
