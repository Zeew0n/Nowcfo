import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpGenericCrudService } from '../../../services/http-generic-crud.service';
import { Observable } from 'rxjs';
import { OrganizationModel } from 'src/app/models/organization.model';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService extends HttpGenericCrudService<OrganizationModel> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.API_URL, 'organization/');
  }
  protected setHeader() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return httpOptions;
  }

  getAllOrganizations(): Observable<OrganizationModel[]> {
    return this.httpClient.get<OrganizationModel[]>('organization');
  }

  getOrganizationById(id): Observable<OrganizationModel> {
    return this.httpClient.get<OrganizationModel>('organization/' + id);
  }

  createOrganization(data) {
    return this.httpClient.post('organization', data);
  }

  deleteOrganization(id) {
    return this.httpClient.delete('organization/' + id);
  }

  updateOrganization(id, data: OrganizationModel) {
    return this.httpClient.put('organization/' + id, data);
  }
}
