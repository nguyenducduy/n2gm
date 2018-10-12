import { decode, sign, verify } from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
    public sign(user: any) {
        return sign(
            {
                id: user.id,
                screenName: user.screenName,
                fullName: user.fullName,
                email: user.email,
                avatar: user.avatar,
                isStaff: user.isStaff,
                isVerified: user.isVerified,
                isSuperUser: user.isSuperUser,
                groups: user.groups.map(group => {
                    return { name: group.name };
                })
            },
            this.getSecretKey({
                id: user.id,
                isStaff: user.isStaff,
                isVerified: user.isVerified,
                isSuperUser: user.isSuperUser,
                groups: user.groups
            }),
            {
                expiresIn: '1y'
            }
        );
    }

    public verify(token: string) {
        const data: any = decode(token);
        return verify(token, this.getSecretKey(data));
    }

    public decode(token: string) {
        return decode(token);
    }

    private getSecretKey(data: any) {
        return (
            process.env.AUTH_SALT +
            (data
                ? '$' +
                  data.id +
                  '$' +
                  data.isStaff +
                  '$' +
                  data.isVerified +
                  '$' +
                  data.isSuperUser +
                  (data.groups ? data.groups.map(group => '$' + group.name) : '')
                : '')
        );
    }
}
