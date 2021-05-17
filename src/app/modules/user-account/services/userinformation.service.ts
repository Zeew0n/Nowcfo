import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpGenericCrudService } from '../../../shared/http-generic-crud.service';
import { Observable } from 'rxjs';
import { RoleModel } from 'src/app/models/role.model';
import { UserInformationModel } from 'src/app/models/userinformation.model';
import { PasswordUpdateModel } from 'src/app/models/user/user-password.update.model';


@Injectable({
    providedIn: 'root'
})
export class UserInformationService extends HttpGenericCrudService<UserInformationModel>{
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            environment.API_URL,
            'user',
        );
    }
    getAllUsers(): Observable<UserInformationModel[]> {
        return this.httpClient.get<UserInformationModel[]>('user/listallusers');
    }
    getAllRoles(): Observable<RoleModel[]> {
        return this.httpClient.get<RoleModel[]>('Role/Listrole');
    }
    getUserById(id): Observable<UserInformationModel> {
        return this.httpClient.get<UserInformationModel>('user/UserId?UserId=' + id);
    }
    CreateUser(data){
        return this.httpClient.post('user/create', data);
    }
    DeleteUser(id){
        return this.httpClient.delete('user/delete/' + id);
    }
    updateUser(data: UserInformationModel) {
        return this.httpClient.put('user/update', data);
    }
    changePassword(data: PasswordUpdateModel) {
        return this.httpClient.put('user/changepassword', data);
    }

    checkEmailExists(email:string) {
        debugger
        return this.httpClient.get('user/CheckIfEmailExists/'+email);
    }

    checkUsernameExists(userName:string) {
        return this.httpClient.get('user/CheckIfUsernameExists/'+userName);
    }
    
}
