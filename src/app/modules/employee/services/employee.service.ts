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


@Injectable({
    providedIn: 'root'
})
export class EmployeeService extends HttpGenericCrudService<EmployeeModel>{
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            environment.API_URL,
            'employee-information/',
        );
    }

    public previewdata = new EventEmitter();
    protected setHeader() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return httpOptions;
    }

    getAllEmployees(){
      return this.httpClient.get<EmployeeModel[]>('employee');
    }

    getPaginatedEmployees(
        page?,
        itemsPerPage?,
        searchOrg?,
        searchStatus?,
        searchTypeId?,
        searchValue?

      ): Observable<PaginatedResult<EmployeeModel[]>> {

        const paginatedResult: PaginatedResult<EmployeeModel[]> = new PaginatedResult<
        EmployeeModel[] >();
        let params = new HttpParams();
        if (page != null && itemsPerPage != null) {
          params = params.append('pageNumber', page);
          params = params.append('pageSize', itemsPerPage);
          params = params.append('searchOrg', searchOrg);
          params = params.append('searchStatus', searchStatus);
          params = params.append('searchType', searchTypeId);
          params = params.append('searchValue', searchValue);


        }
        return this.httpClient
          .get<EmployeeModel[]>('employee/PaginatedEmployees', { observe: 'response', params })
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


    getEmployeeById(id: string): Observable<EmployeeModel> {
        return this.httpClient.get<EmployeeModel>(`employee/${id}`);
    }

    getAllDesignations(): Observable<DesignationModel[]> {
        return this.httpClient.get<DesignationModel[]>('designation');
    }

    getAllSuperVisors(): Observable<EmployeeModel[]> {
        return this.httpClient.get<EmployeeModel[]>('employee/listallsupervisors/');
    }


    getAllEmployeeTypes(): Observable<EmployeeTypeModel[]> {
      return this.httpClient.get<EmployeeTypeModel[]>('employee/GetEmployeeTypes/');
  }

  getAllEmployeeStatusTypes(): Observable<EmployeeStatusTypeModel[]> {
    return this.httpClient.get<EmployeeStatusTypeModel[]>('employee/GetEmployeeStatusTypes/');
}


    getSyncTreeView(): Observable<OrganizationSyncFusionModel[]> {
        return this.httpClient.get<OrganizationSyncFusionModel[]>('employee/SyncHierarchy');
    }

    createEmployee(data){
       return this.httpClient.post('employee', data);
    }

    deleteEmployee(id) {
        return this.httpClient.delete('employee/' + id);
    }

    getEmployeePermissionNavigationById(employeeId) {
        return this.httpClient.get<OrganizationSyncFusionModel[]>(`employee/EmployeePermission/${employeeId}`);
    }

    updateEmployee(id, data) {
        return this.httpClient.put('employee/' + id, data);
    }

    getEmployeesBySearchValue(searchText: string): Observable<EmployeeModel[]> {
      return this.httpClient.get<EmployeeModel[]>('employee/EmployeesAutocomplete/' + searchText);
    }

    assignEmployee(data) {
      return this.httpClient.put('employee/AssignEmployee', data);
    }


    
    getAllEmployeePermissions(){
      return this.httpClient.get<EmployeePermission[]>('EmployeePermission');
    }
    
    getEmployeePermissionById(id: string): Observable<EmployeePermission> {
      return this.httpClient.get<EmployeePermission>(`EmployeePermission/${id}`);
  }

    createEmployeePermission(data){
      return this.httpClient.post('EmployeePermission', data);
   }

   updateEmployeePermission(id, data) {
    return this.httpClient.put('EmployeePermission/' + id, data);
}

deleteEmployeePermission(id) {
  return this.httpClient.delete('EmployeePermission/' + id);
}

getLevelOrganizations(id: number){
  return this.httpClient.get<OrganizationModel[]>(`EmployeePermission/GetLevelOrganizations/${id}`);
}

}
