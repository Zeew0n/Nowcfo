import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpGenericCrudService } from '../../../shared/http-generic-crud.service';
import { Observable } from 'rxjs';
import { OrganizationModel } from 'src/app/models/organization.model';
import { PaginatedResult } from 'src/app/models/Pagination/Pagination';
import { map } from 'rxjs/operators';
import { MarketMasterModel } from 'src/app/models/Market/market-master.model';


@Injectable({
    providedIn: 'root'
})
export class MarketService extends HttpGenericCrudService<MarketMasterModel>{
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            environment.API_URL,
            'market-master/',
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



    getPaginatedAllocation(
        page?,
        itemsPerPage?,
        searchOrg?,

      ): Observable<PaginatedResult<MarketMasterModel[]>> {

        const paginatedResult: PaginatedResult<MarketMasterModel[]> = new PaginatedResult<
        MarketMasterModel[] >();
        let params = new HttpParams();
        if (page != null && itemsPerPage != null) {
          params = params.append('pageNumber', page);
          params = params.append('pageSize', itemsPerPage);
          params = params.append('searchOrg', searchOrg);


        }
        return this.httpClient
          .get<MarketMasterModel[]>('MarketMaster/PaginatedAllocation', { observe: 'response', params })
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


    getAllOrganizations(){
      return this.httpClient.get<OrganizationModel[]>('MarketMaster/listallorganizations');
    }


    getMarketAllocationModelListByOrgId(organizationId:number): Observable<MarketMasterModel[]> {
        return this.httpClient.get<MarketMasterModel[]>(`MarketMaster/GetMarketAllocationModelListByOrgId/${organizationId}`);
    }


    createMarketMaster(data){
       return this.httpClient.post('MarketMaster', data);
    }

    deleteMarketAllocationModel(id) {
        return this.httpClient.delete('MarketMaster/' + id);
    }


    updateMarketAllocationModel(id, data) {
        return this.httpClient.put('MarketMaster/' + id, data);
    }


}
