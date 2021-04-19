import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpGenericCrudService } from '../../../shared/http-generic-crud.service';
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

  getParentMenusForPermission(): Observable<MenuModel[]>{
    return this.httpClient.get<MenuModel[]>('Role/ParentMenusForPermission');
  }

  createRole(data) {
    return this.httpClient.post('role/Create', data);
  }

  deleteRole(Id) {
    return this.httpClient.delete('role/deleterole/' + Id);
  }

  updateRole(data: RoleModel) {
    return this.httpClient.put('role/UpdateRole', data);
  }
  getRoleById(id: string): Observable<RoleModel> {
    return this.httpClient.get<RoleModel>('role/Role' + id);
  }

  getRolePermission(id: string): Observable<RolePermissionModel>{
    return this.httpClient.get<RolePermissionModel>('role/ReadRolePermission/' + id);
  }

  addPermissionPermission(data: RolePermissionModel){
    return this.httpClient.post('role/CreateRolePermission', data);
  }

  editRolePermission(data: RolePermissionModel){
    return this.httpClient.put('role/UpdateRolePermission', data);
  }
}
