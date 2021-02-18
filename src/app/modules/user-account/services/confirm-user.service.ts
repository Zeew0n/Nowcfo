import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({
    providedIn: 'root'
})

export class ConfirmUserService{

    constructor(private httpClient: HttpClient) {
      
    }




    confirmUser(id, token) {
        return this.httpClient.get('user/confirmUser', { params: { userId: id, token } });
       // return this.httpClient.put('user/confirmUser', { params: { userId: id, token } });
    }

    
}