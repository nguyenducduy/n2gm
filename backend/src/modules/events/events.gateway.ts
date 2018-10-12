import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@WebSocketGateway(9001)
export class EventsGateway {
    @WebSocketServer() server;

    @SubscribeMessage('events')
    findAll(client, data): Observable<WsResponse<number>> {
        console.log(data);
        return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
    }

    @SubscribeMessage('identity')
    async identity(client, data: number): Promise<number> {
        return data;
    }
}
