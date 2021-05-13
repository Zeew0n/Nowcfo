import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpGenericCrudService } from '../../../shared/http-generic-crud.service';
import { Observable } from 'rxjs';
import { SalesForecastModel } from 'src/app/models/SalesForecast/sales-forecast.model.';
import { PaginatedResult } from 'src/app/models/Pagination/Pagination';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SalesForecastService extends HttpGenericCrudService<SalesForecastModel>{
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            environment.API_URL,
            'sales-forecasts/',
        );
    }

    protected setHeader() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return httpOptions;
    }


    getPaginatedForecast(
        page?,
        itemsPerPage?,

    ): Observable<PaginatedResult<SalesForecastModel[]>> {

        const paginatedResult: PaginatedResult<SalesForecastModel[]> = new PaginatedResult<
            SalesForecastModel[]>();
        let params = new HttpParams();
        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }
        return this.httpClient
            .get<SalesForecastModel[]>('SalesForecasts/PaginatedForecasts', { observe: 'response', params })
            .pipe(
                map(response => {
                    paginatedResult.result = response.body;
                    if (response.headers.get('Pagination') != null) {
                        paginatedResult.pagination = JSON.parse(
                            response.headers.get('Pagination')
                        );
                    }
                    return paginatedResult;
                })
            );
    }


    getAllForecasts() {
        return this.httpClient.get<SalesForecastModel[]>('SalesForecasts');
    }

    getForecastById(id: string): Observable<SalesForecastModel> {
        return this.httpClient.get<SalesForecastModel>(`SalesForecasts/${id}`);
    }
    createForecast(data) {
        return this.httpClient.post('SalesForecasts', data);
    }

    deleteForecast(id) {
        return this.httpClient.delete('SalesForecasts/' + id);
    }

    updateForecast(id, data) {
        return this.httpClient.put('SalesForecasts/' + id, data);
    }

}
