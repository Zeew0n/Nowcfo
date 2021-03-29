import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpGenericCrudService } from '../../../services/http-generic-crud.service';
import { Observable } from 'rxjs';
import { RoleModel } from 'src/app/models/role.model';
import { MenuModel } from 'src/app/models/menu.model';
import { RolePermissionModel } from 'src/app/models/role-permission';

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


  getAllRoles(): Observable<RoleModel[]> {
    return this.httpClient.get<RoleModel[]>('role/Listrole');
  }

  getAllMenus(): Observable<MenuModel[]>{
    return this.httpClient.get<MenuModel[]>('role/menus');
  }

  CreateRole(data) {
    return this.httpClient.post('role/Create', data);
  }

  DeleteRole(Id) {
    return this.httpClient.delete('role/deleterole/' + Id);
  }

  UpdateRole(data: RoleModel) {
    return this.httpClient.put('role/UpdateRole', data);
  }

  addPermissionPermission(data: RolePermissionModel){
    return this.httpClient.post('role/CreateRolePermission', data);
  }

  editRolePermission(data: RolePermissionModel){
    return this.httpClient.put('role/UpdateRolePermission', data);
  }

  getRoleById(id: string): Observable<RoleModel> {
    return this.httpClient.get<RoleModel>('role/Role' + id);
  }
  getRolePermission(id: string): Observable<RolePermissionModel>{
    return this.httpClient.get<RolePermissionModel>('RolePermission/ReadRolePermission/' + id);
  }
}
