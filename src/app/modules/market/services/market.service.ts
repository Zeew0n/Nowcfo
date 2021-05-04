import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpGenericCrudService } from '../../../shared/http-generic-crud.service';
import { Observable } from 'rxjs';
import { DesignationModel } from 'src/app/models/designation.model';
import { EmployeeModel } from 'src/app/models/employee.model';
import { OrganizationModel } from 'src/app/models/organization.model';
import { OrganizationSyncFusionModel } from 'src/app/models/organization-syncfusion.model';
import { PaginatedResult } from 'src/app/models/Pagination/Pagination';
import { map } from 'rxjs/operators';
import { EmployeeTypeModel } from 'src/app/models/employeetype.model';
import { EmployeeStatusTypeModel } from 'src/app/models/employeestatus.model';
import { EmployeePermission } from 'src/app/models/employeepermission.model';
import { MarketMaster } from 'src/app/models/Market/market-master.model';
import { MarketAllocation } from 'src/app/models/Market/market-allocation.model';


@Injectable({
    providedIn: 'root'
})
export class MarketService extends HttpGenericCrudService<MarketMaster>{
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

    getAllOrganizations(){
      return this.httpClient.get<OrganizationModel[]>('MarketMaster/listallorganizations');
    }


    getMarketAllocationListByOrgId(organizationId:number): Observable<MarketMaster[]> {
        return this.httpClient.get<MarketMaster[]>(`MarketMaster/GetMarketAllocationListByOrgId/${organizationId}`);
    }


    createMarketMaster(data){
       return this.httpClient.post('MarketMaster', data);
    }

    deleteMarketAllocation(id) {
        return this.httpClient.delete('MarketMaster/' + id);
    }


    updateMarketAllocation(id, data) {
        return this.httpClient.put('MarketMaster/' + id, data);
    }


}
