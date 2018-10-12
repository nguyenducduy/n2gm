import { Inject, Injectable } from '@nestjs/common';
import {
    BulkIndexDocumentsParams,
    ClearScrollParams,
    Client,
    CountParams,
    CreateDocumentParams,
    DeleteDocumentByQueryParams,
    DeleteDocumentParams,
    DeleteScriptParams,
    ExistsParams,
    FieldStatsParams,
    GetParams,
    IndexDocumentParams,
    InfoParams,
    PingParams,
    SearchParams,
    UpdateDocumentByQueryParams,
    UpdateDocumentParams
} from 'elasticsearch';

@Injectable()
export class SearchService {
    constructor(
        @Inject('EsConnectionToken') private readonly esClient: Client,
    ) { }

    getClient(): Client {
        return this.esClient;
    }

    clearScroll(params: ClearScrollParams): Promise<any> {
        return this.esClient.clearScroll(params);
    }

    ping(params: PingParams): Promise<any> {
        return this.esClient.ping(params);
    }

    search(params: SearchParams): Promise<any> {
        return this.esClient.search(params);
    }

    count(params: CountParams): Promise<any> {
        return this.esClient.count(params);
    }

    create(params: CreateDocumentParams): Promise<any> {
        return this.esClient.create(params);
    }

    update(params: UpdateDocumentParams): Promise<any> {
        return this.esClient.update(params);
    }

    updateByQuery(params: UpdateDocumentByQueryParams): Promise<any> {
        return this.esClient.updateByQuery(params);
    }

    delete(params: DeleteDocumentParams): Promise<any> {
        return this.esClient.delete(params);
    }

    deleteByQuery(params: DeleteDocumentByQueryParams): Promise<any> {
        return this.esClient.deleteByQuery(params);
    }

    deleteScript(params: DeleteScriptParams): Promise<any> {
        return this.esClient.deleteScript(params);
    }

    exists(params: ExistsParams): Promise<any> {
        return this.esClient.exists(params);
    }

    bulk(params: BulkIndexDocumentsParams): Promise<any> {
        return this.esClient.bulk(params);
    }

    fieldStats(params: FieldStatsParams): Promise<any> {
        return this.esClient.fieldStats(params);
    }

    get(params: GetParams): Promise<any> {
        return this.esClient.get(params);
    }

    index<T>(params: IndexDocumentParams<T>): Promise<any> {
        return this.esClient.index(params);
    }

    info(params: InfoParams): Promise<any> {
        return this.esClient.info(params);
    }

    close() {
        return this.esClient.close();
    }
}
