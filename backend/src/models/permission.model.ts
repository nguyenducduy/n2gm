import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    BaseEntity
} from 'typeorm';
import { IsNotEmpty, validate } from 'class-validator';
import { PermissionExisted } from './validators/permission-existed';
import { ValidateException } from '../shared/filters/validate.exception';
import { Group } from ".";

@Entity({ name: 'permission' })
export class Permission extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'pe_id' })
    id: number;

    @Column({ name: 'pe_name' })
    @IsNotEmpty()
    @PermissionExisted({ message: 'Permission already existed.' })
    name: string;

    @Column({ name: 'pe_description' })
    @IsNotEmpty()
    description: string;

    @ManyToMany(type => Group)
    @JoinTable({
        name: 'rel_group_permission',
        joinColumn: {
            name: 'pe_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'gr_id',
            referencedColumnName: 'id'
        }
    })
    groups: Group[];

    @BeforeInsert()
    private async doBeforeInsertion() {
        const errors = await validate(this, {
            validationError: { target: false }
        });

        if (errors.length > 0) {
            throw new ValidateException(errors);
        }
    }

    @BeforeUpdate()
    private async doBeforeUpdate() {
        const errors = await validate(this, {
            validationError: { target: false },
            skipMissingProperties: true
        });
        if (errors.length > 0) {
            throw new ValidateException(errors);
        }
    }
}
