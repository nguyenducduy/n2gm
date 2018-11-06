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
import { User, Permission } from ".";

@Entity({ name: 'group' })
export class Group {
    @PrimaryGeneratedColumn({ name: 'gr_id' })
    id: number;

    @Column({ name: 'gr_name', unique: true })
    @IsNotEmpty()
    name: string;

    @Column({ name: 'gr_screen_name', unique: true })
    @IsNotEmpty()
    screenName: string;

    @Column({ name: 'gr_style' })
    style: string;

    @ManyToMany(type => User)
    @JoinTable({
        name: 'rel_user_group',
        joinColumn: {
            name: 'gr_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'u_id',
            referencedColumnName: 'id'
        }
    })
    users: User[];

    @ManyToMany(type => Permission)
    @JoinTable({
        name: 'rel_group_permission',
        joinColumn: {
            name: 'gr_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'pe_id',
            referencedColumnName: 'id'
        }
    })
    permissions: Permission[];

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
