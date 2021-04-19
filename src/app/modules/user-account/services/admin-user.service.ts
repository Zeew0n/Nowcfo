import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuModel } from 'src/app/models/menu.model';
import { HttpGenericCrudService } from 'src/app/shared/http-generic-crud.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService extends HttpGenericCrudService <MenuModel> {
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

  getChildMenus( parentMenuId: string): Observable<MenuModel[]> {
    return this.httpClient.get<MenuModel[]>(`menu/childMenus/${parentMenuId}`);
  }
}
