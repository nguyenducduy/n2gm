import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import * as elasticsearch from 'elasticsearch';
import { ConfigService } from '../../shared/config.service';

@Module({
    providers: [
        SearchService,
        {
            provide: 'EsConnectionToken',
            useFactory: async () => {
                return await new elasticsearch.Client({
                    host: `http://127.0.0.1:9200`,
                    // log: process.env.NODE_ENV === 'dev' ? 'trace' : ''
                });
            }
        },
        { provide: ConfigService, useValue: new ConfigService() }
    ],
    exports: [SearchService],
})
export class SearchModule { }
