import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    BaseEntity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne
} from 'typeorm';
import { IsNotEmpty, validateSync } from 'class-validator';
import { Group, PermissionObject } from ".";

@Entity({ name: 'permission' })
export class Permission extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'pe_id' })
    id: number;

    @Column({ name: 'pe_name' })
    @IsNotEmpty()
    name: string;

    @Column({ name: 'pe_description' })
    @IsNotEmpty()
    description: string;

    @ManyToOne(type => PermissionObject, { eager: true, nullable: true })
    @JoinColumn({ name: 'po_id' })
    permissionObject: PermissionObject;

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

    // @BeforeInsert()
    // doBeforeInsertion() {
    //   const errors = validateSync(this, { validationError: { target: false } });

    //   if (errors.length > 0) {
    //     throw errors;
    //   }
    // }

    // @BeforeUpdate()
    // doBeforeUpdate() {
    //   const errors = validateSync(this, { validationError: { target: false } });

    //   if (errors.length > 0) {
    //     throw errors;
    //   }
    // }
}
