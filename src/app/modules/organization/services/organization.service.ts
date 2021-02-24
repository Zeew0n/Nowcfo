import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpGenericCrudService } from '../../../services/http-generic-crud.service';
import { Observable } from 'rxjs';
import { RoleModel } from 'src/app/models/role.model';
import { UserInformationModel } from 'src/app/models/userinformation.model';
import { OrganizationModel } from 'src/app/models/organization.model';


@Injectable({
    providedIn: 'root'
})
export class OrganizationService extends HttpGenericCrudService<OrganizationModel>{
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            environment.API_URL,
            'organization-information/',
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

    GetAllOrganizations(): Observable<OrganizationModel[]> {
        return this.httpClient.get<OrganizationModel[]>('organization/listallorganizations')
    }






    GetOrganizationById(id): Observable<OrganizationModel> {
        return this.httpClient.get<OrganizationModel>('organization/getorganization?id=' + id);
    }


    CreateOrganization(data)
    {
       
        return this.httpClient.post('organization/create', data);
    }


    DeleteOrganization(id)
    {
        return this.httpClient.delete('organization/delete/'+id);
    }


      UpdateOrganization(id,data: OrganizationModel) {
        return this.httpClient.put('organization/update?id='+id, data);
      }

}
