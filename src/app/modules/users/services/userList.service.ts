import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AdminSignUpModel } from '../../../models/user/admin-signup.model';
import { AppUserModel } from '../../../models/app-user.model';
import { Observable } from 'rxjs';
import { UserListModel } from 'src/app/models/user/user-list.model';


@Injectable({
    providedIn: 'root'
})
export class UserListService{
    constructor(private httpClient: HttpClient) {
    }

    getAllUsers(): Observable<Array<UserListModel>> {
        console.log("Namaste");
        return this.httpClient.get<Array<UserListModel>>('user/get');
      }

}
