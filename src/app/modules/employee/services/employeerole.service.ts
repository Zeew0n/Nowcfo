import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpGenericCrudService } from '../../../services/http-generic-crud.service';
import { Observable } from 'rxjs';
import { DesignationModel } from 'src/app/models/designation.model';

@Injectable({
  providedIn: 'root',
})
export class DesignationService extends HttpGenericCrudService<DesignationModel> {

  constructor(httpClient: HttpClient) {
    super(httpClient, environment.API_URL, 'designation/');
  }

  protected setHeader() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return httpOptions;
  }


  getAllRoles(): Observable<DesignationModel[]> {
    return this.httpClient.get<DesignationModel[]>('designation');
  }

  createDesignation(data) {
    return this.httpClient.post('designation/', data);
  }

  deleteDesignation(id) {
    return this.httpClient.delete('designation/' + id);
  }

  updateDesignation(id, data: DesignationModel) {
    return this.httpClient.put('designation/' + id, data);
  }

}
