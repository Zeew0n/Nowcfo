import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpGenericCrudService } from '../../../services/http-generic-crud.service';
import { Observable } from 'rxjs';
import { DesignationModel } from 'src/app/models/designation.model';
import { EmployeeModel } from 'src/app/models/employee.model';
import { OrganizationModel } from 'src/app/models/organization.model';
import { PaginatedResult } from 'src/app/models/Pagination/Pagination';
import { map } from 'rxjs/operators';
import { OrganizationSyncFusionModel } from 'src/app/models/organization-syncfusion.model';
import { UserPermissionModel } from 'src/app/models/userpermission.model';


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
    protected setHeader() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return httpOptions;
    }

    getPaginatedEmployees(
    page?,
    itemsPerPage?,
    searchTypeId?,
    searchValue?

  ): Observable<PaginatedResult<EmployeeModel[]>> {
    const paginatedResult: PaginatedResult<EmployeeModel[]> = new PaginatedResult<
    EmployeeModel[] >();
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
      params = params.append('searchType', searchTypeId);
      params = params.append('searchValue', searchValue);

    }
    return this.httpClient
      .get<EmployeeModel[]>('employee', { observe: 'response', params })
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
    getNonPaginatedEmployees(): Observable<EmployeeModel[]> {
      return this.httpClient.get<EmployeeModel[]>('employee/NonPaginatedEmployees');
    }

    getAllEmployees(): Observable<EmployeeModel[]> {
      return this.httpClient.get<EmployeeModel[]>('employee');
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

    GetAllOrganizations(): Observable<OrganizationModel[]> {
        return this.httpClient.get<OrganizationModel[]>('organization');
    }


    CreateEmployee(data){
       return this.httpClient.post('employee', data);
    }


    DeleteEmployee(id){
        return this.httpClient.delete('employee/' + id);
    }

    GetSyncTreeView(): Observable<OrganizationSyncFusionModel[]> {
      return this.httpClient.get<OrganizationSyncFusionModel[]>('employee/SyncHierarchy');
  }

    public previewdata = new EventEmitter();

    getEmployeePermissionNavigationById(employeeId) {

    return this.httpClient.get<OrganizationSyncFusionModel[]>(`employee/EmployeePermission/${employeeId}`)
    }

    getCheckedPermission(employeeId) {
      return this.httpClient.get<UserPermissionModel[]>(`employee/CheckedPermission/${employeeId}`)
    }

    updateEmployee(id, data) {
        return this.httpClient.put('employee/' + id, data);
    }

    getEmployeesBySearchValue(searchText: string): Observable<EmployeeModel[]> {
      return this.httpClient.get<EmployeeModel[]>('employee/EmployeesAutocomplete/' + searchText);
    }

    AssignEmployee(data) {
      return this.httpClient.put('employee/AssignEmployee', data);
    }

}
