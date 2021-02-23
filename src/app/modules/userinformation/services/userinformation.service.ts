import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpGenericCrudService } from '../../../services/http-generic-crud.service';
import { Observable } from 'rxjs';
import { RoleModel } from 'src/app/models/role.model';
import { UserInformationModel } from 'src/app/models/userinformation.model';


@Injectable({
    providedIn: 'root'
})
export class UserInformationService extends HttpGenericCrudService<UserInformationModel>{
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            environment.API_URL,
            'user-information/',
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

    private readonly Ref_TENANTID = 'tenant_id';


    tenantId = localStorage.getItem(this.Ref_TENANTID);

    GetAllUsers(): Observable<UserInformationModel[]> {
        return this.httpClient.get<UserInformationModel[]>('user/listallusers')
    }


    GetAllRoles(): Observable<RoleModel[]> {
        return this.httpClient.get<RoleModel[]>('Role/Listrole');
    }




    GetUserById(id): Observable<UserInformationModel> {
        return this.httpClient.get<UserInformationModel>('user/UserId?UserId=' + id);
    }


    CreateUser(data)
    {
       
        return this.httpClient.post('user/create', data);
    }


    DeleteUser(id)
    {
        return this.httpClient.delete('user/delete/'+id);
    }


    // getCompanyById(companyId: string): Observable<InternalCompanyModel> {
        
    //     return this.httpClient.get<InternalCompanyModel>(`InternalCompany/detailcompany/${companyId}`);
    //   }


      updateUser(data: UserInformationModel) {
        return this.httpClient.put('user/update', data);
      }

    // POSTED(data){
    //     return this.httpClient.post('internalcompany/', data);
    // }

}
