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
import { IsNotEmpty, IsEmail, validate } from "class-validator";
import { UserExisted } from './validators/user-existed';
import { ValidateException } from '../shared/filters/validate.exception';
import { hashPassword } from "../shared/helpers";
import { Group, RelUserGroup } from '.';

@Entity({ name: 'user' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'u_id' })
    public id: number = 0;

    @Column({ name: 'u_screen_name' })
    public screenName: string = '';

    @Column({ name: 'u_full_name' })
    public fullName: string = '';

    @Column({ name: 'u_email' })
    @IsNotEmpty({ message: 'Email is not empty' })
    @IsEmail()
    @UserExisted({ message: 'User already existed.' })
    public email: string = '';

    @Column({ name: 'u_password' })
    @IsNotEmpty({ message: 'Password is not empty' })
    public password: string = '';

    @Column({ name: 'u_avatar' })
    public avatar: string = '';

    @Column({ name: 'u_status' })
    public status: number = 0;

    @Column({ name: 'u_oauth_provider' })
    public oauthProvider: string = '';

    @Column({ name: 'u_oauth_uid' })
    public oauthUid: string = '';

    @Column({ name: 'u_oauth_access_token' })
    public oauthAccessToken: string = '';

    @Column({ name: 'u_mobile_number' })
    public mobileNumber: string = '';

    @Column({ name: 'u_is_verified' })
    public isVerified: number = 0;

    @Column({ name: 'u_is_super_user' })
    public isSuperUser: number = 0;

    @Column({ name: 'u_is_staff' })
    public isStaff: number = 0;

    @Column({ name: 'u_verify_type' })
    public verifyType: number = 0;

    @Column({ name: 'u_is_profile_updated' })
    public isProfileUpdated: number = 0;

    @Column({ name: 'u_date_last_change_password' })
    public dateLastChangePassword: number = 0;

    @Column({ name: 'u_date_created' })
    public dateCreated: number = 0;

    @Column({ name: 'u_date_modified' })
    public dateModified: number = 0;

    @ManyToMany(type => Group, { cascade: ['remove'] })
    @JoinTable({
        name: 'rel_user_group',
        joinColumn: {
            name: 'u_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'gr_id',
            referencedColumnName: 'id'
        }
    })
    groups: Group[];

    public static IS_SUPER_USER: number = 1;
    public static IS_NOT_SUPER_USER: number = 3;
    public static IS_STAFF: number = 1;
    public static IS_NOT_STAFF: number = 3;
    public static IS_VERIFIED: number = 1;
    public static IS_NOT_VERIFIED: number = 3;
    public static VERIFY_TYPE_EMAIL: number = 1;
    public static VERIFY_TYPE_PHONE: number = 3;
    public static IS_PROFILE_UPDATED: number = 1;
    public static IS_PROFILE_NOT_UPDATED: number = 3;
    public static STATUS_ACTIVE: number = 1;
    public static STATUS_BLOCKED: number = 3;

    @BeforeInsert()
    private async doBeforeInsertion() {
        this.dateCreated = Math.floor(Date.now() / 1000);
        this.password = hashPassword(this.password);

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

    public async comparePassword(password: string) {
        const h = hashPassword(password);
        return (this.password === h) ? true : false;
    }

    public checkPermissions(permissions: string[]) {
        // is has domain specified or another service, u need custom this function to add
        // where permission in permission_object table to validate user permission
        permissions = permissions.map(permission => permission.toLowerCase());

        return (
            this.groups.filter(
                group =>
                    group &&
                    group.permissions.filter(permission => permissions.indexOf(permission.name.toLowerCase()) !== -1)
                        .length > 0
            ).length > 0
        );
    }

    public static getStatusList() {
        return [
            { name: 'Active', value: User.STATUS_ACTIVE },
            { name: 'Blocked', value: User.STATUS_BLOCKED },
        ];
    }

    public getStatusName() {
        let name: string = "";

        switch (this.status) {
            case User.STATUS_ACTIVE:
                name = "Active";
                break;
            case User.STATUS_BLOCKED:
                name = "Blocked";
                break;
        }

        return name;
    }

    public getIsVerifiedName() {
        let name: string = '';

        switch (this.isVerified) {
            case User.IS_VERIFIED:
                name = 'Verified';
                break;
            case User.IS_NOT_VERIFIED:
                name = 'Not verify';
                break;
        }

        return name;
    }

    public getVerifyTypeName() {
        let name: string = '';

        switch (this.verifyType) {
            case User.VERIFY_TYPE_EMAIL:
                name = 'Email';
                break;
            case User.VERIFY_TYPE_PHONE:
                name = 'Phone';
                break;
        }

        return name;
    }

    public getIsProfileUpdatedName() {
        let name: string = '';

        switch (this.isProfileUpdated) {
            case User.IS_PROFILE_UPDATED:
                name = 'Updated';
                break;
            case User.IS_PROFILE_NOT_UPDATED:
                name = 'Not update';
                break;
        }

        return name;
    }
}
