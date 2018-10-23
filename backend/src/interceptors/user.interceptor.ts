import { Injectable, NestInterceptor, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import * as moment from "moment";

export interface Response<T> {
    data: T;
}

@Injectable()
export class UserInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, call$: Observable<T>): Observable<any> {
        return call$.pipe(
            tap(async data => {
                if (typeof data.users !== "undefined") {
                    data.users.map(user => this._transform(user));
                } else {
                    data = this._transform(data);
                }

                return data;
            })
        );
    }

    private _transform(user) {
        user.status = {
            label: user.getStatusName(),
            value: user.status,
            style: user.getStatusStyle()
        };
        user.verifyType = {
            label: user.getVerifyTypeName(),
            value: user.verifyType,
            style: user.getVerifyTypeStyle()
        };
        user.dateCreated = {
            readable: moment.unix(user.dateCreated).format("MMM Do YYYY"),
            timestamp: user.dateCreated
        };
        user.dateLastChangePassword = {
            readable: moment.unix(user.dateLastChangePassword).format("MMM Do YYYY"),
            timestamp: user.dateLastChangePassword
        };
    }
}
