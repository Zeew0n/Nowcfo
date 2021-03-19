import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpGenericCrudService } from '../../../services/http-generic-crud.service';
import { Observable } from 'rxjs';
import { DesignationModel } from 'src/app/models/designation.model';
import { MenuModel } from 'src/app/models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService extends HttpGenericCrudService<MenuModel> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.API_URL, 'menu/');
  }
  protected setHeader() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return httpOptions;
  }


  GetAllMenus(): Observable<MenuModel[]> {
    return this.httpClient.get<MenuModel[]>('menu');
  }

  CreateMenu(data) {
    return this.httpClient.post('menu/', data);
  }

  DeleteMenu(id) {
    debugger
    return this.httpClient.delete('menu/'+id);
  }

  UpdateMenu(id, data: MenuModel) {
    return this.httpClient.put('menu/' + id, data);
  }
}
