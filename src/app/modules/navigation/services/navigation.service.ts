import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpGenericCrudService } from '../../../shared/http-generic-crud.service';
import { Observable } from 'rxjs';
import { OrganizationNavModel } from 'src/app/models/OrganizationNavModel';
import { EmployeeModel } from 'src/app/models/employee.model';
import { MenuModel } from 'src/app/models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class NavigationService extends HttpGenericCrudService<OrganizationNavModel> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.API_URL, 'Organization');
  }
  protected setHeader() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return httpOptions;
  }

  public getOrganizationNavigation(): any {
    return this.httpClient.get<OrganizationNavModel[]>(
      'Organization/OrganizationHierarchy'
    );
  }

  getEmployeesByOrganizationId( id): any {
    return this.httpClient.get<EmployeeModel[]>('Organization/EmployeesByOrganizationHierarchy/' + id);
  }

  getAssignedMenus(): Observable<MenuModel[]> {
    return this.httpClient.get<MenuModel[]>('Menu/AssignedMenus');
  }
}
