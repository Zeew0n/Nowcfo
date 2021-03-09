import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpGenericCrudService } from '../../../services/http-generic-crud.service';
import { Observable } from 'rxjs';
import { RoleModel } from 'src/app/models/role.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService extends HttpGenericCrudService<RoleModel> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.API_URL, 'role/');
  }
  protected setHeader() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return httpOptions;
  }


  GetAllRoles(): Observable<RoleModel[]> {
    return this.httpClient.get<RoleModel[]>('role/Listrole');
  }

  CreateRole(data) {
    return this.httpClient.post('role/Create', data);
  }

  DeleteRole(Id) {
    return this.httpClient.delete('role/deleterole/'+Id);
  }

  UpdateRole(data: RoleModel) {
    return this.httpClient.put('role/UpdateRole', data);
  }
}
