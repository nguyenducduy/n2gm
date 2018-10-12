import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserException } from '../../shared/filters/user.exception';
import { User } from '../../models';
import { ConfigService } from '../../shared/config.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly config: ConfigService,
        private readonly tokenService: TokenService
    ) {}

    async login(credentials: { userName: string; password: string }) {
        let myUser = await this.userRepository.findOneOrFail({
            where: {
                email: credentials.userName
            },
            relations: ['groups', 'groups.permissions']
        });

        if (!myUser) {
            myUser = await this.userRepository.findOne({
                where: {
                    mobileNumber: credentials.userName
                },
                relations: ['groups', 'groups.permissions']
            });
        }

        const matchedPassword = await myUser.comparePassword(credentials.password);

        if (!myUser || matchedPassword === false) {
            throw new UserException('auth:login:passwordNotMatch');
        }

        // hide password
        myUser.password = '';

        return {
            user: myUser,
            token: this.tokenService.sign(myUser)
        };
    }
}
