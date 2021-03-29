import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpGenericCrudService } from '../../../services/http-generic-crud.service';
import { Observable } from 'rxjs';
import { RoleModel } from 'src/app/models/role.model';
import { DesignationModel } from 'src/app/models/designation.model';
import { EmployeeModel } from 'src/app/models/employee.model';
import { OrganizationModel } from 'src/app/models/organization.model';
import { EmployeeUpdateModel } from 'src/app/models/EmployeeUpdateModel';
import { EmployeeNavModel } from 'src/app/models/EmployeeNavModel';
import { KendoNavModel } from 'src/app/models/KendoNavModel';
import { PaginatedResult } from 'src/app/models/Pagination/Pagination';
import { map } from 'rxjs/operators';


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

    // getAllEmployees(): Observable<EmployeeModel[]> {
    //     return this.httpClient.get<EmployeeModel[]>('employee');
    // }



    
    getAllEmployees(
    page?,
    itemsPerPage?

  ): Observable<PaginatedResult<EmployeeModel[]>> {
    const paginatedResult: PaginatedResult<EmployeeModel[]> = new PaginatedResult<
    EmployeeModel[] >();
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
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



    getEmployeeById(id: string): Observable<EmployeeUpdateModel> {
        return this.httpClient.get<EmployeeUpdateModel>(`employee/${id}`);
    }

    getAllDesignations(): Observable<DesignationModel[]> {
        return this.httpClient.get<DesignationModel[]>('designation');
    }

    getAllSuperVisors(): Observable<EmployeeModel[]> {
        return this.httpClient.get<EmployeeModel[]>('employee/listallsupervisors/');
    }

    public getKendoNavigation(): any {
        return this.httpClient.get<KendoNavModel[]>(
          'employee/KendoHierarchy'
        );
      }



    GetAllOrganizations(): Observable<OrganizationModel[]> {
        return this.httpClient.get<OrganizationModel[]>('organization');
    }


    CreateEmployee(data)
    {
       console.log(data);
       return this.httpClient.post('employee', data);
    }


    DeleteEmployee(id)
    {
        return this.httpClient.delete('employee/' + id);
    }

    getEmployeePermissionNavigationById( employeeId): any {
        return this.httpClient.get<EmployeeNavModel[]>('employee/listallpermissions/' + employeeId);
      }

      updateEmployee(id, data) {
        return this.httpClient.put('employee/' + id, data);
      }


}
