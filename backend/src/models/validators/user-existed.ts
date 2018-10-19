import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments
} from 'class-validator';
import { User } from '../';

@ValidatorConstraint({ async: true })
export class UserExistedConstraint implements ValidatorConstraintInterface {
    validate(email: string, args: ValidationArguments) {
        return User.findOne({
            email: email
        }).then(user => {
            if (user) return false;
            return true;
        });
    }
}

export function UserExisted(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: UserExistedConstraint
        });
    };
}
