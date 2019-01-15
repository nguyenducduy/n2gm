import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments
} from 'class-validator';
import { Permission } from '../';

@ValidatorConstraint({ async: true })
export class PermissionExistedConstraint implements ValidatorConstraintInterface {
    validate(name: string, args: ValidationArguments) {
        return Permission.findOne({
            name: name
        }).then(perm => {
            if (perm) return false;
            return true;
        });
    }
}

export function PermissionExisted(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: PermissionExistedConstraint
        });
    };
}
