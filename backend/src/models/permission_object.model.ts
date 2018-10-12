import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    BaseEntity,
    JoinTable,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { IsNotEmpty, validateSync } from 'class-validator';
import { Permission } from '.';

@Entity({ name: 'permission_object' })
export class PermissionObject extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'po_id' })
    id: number;

    @Column({ name: 'po_name' })
    @IsNotEmpty()
    name: string;

    @Column({ name: 'po_screen_name' })
    @IsNotEmpty()
    screenName: string;

    @OneToMany(type => Permission, permission => permission.permissionObject)
    permissions: Permission[];

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
