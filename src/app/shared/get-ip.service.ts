import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetIPService {

  private httpClient: HttpClient;

  constructor(handler: HttpBackend) {
    this.httpClient = new HttpClient(handler);
  }

  getIpAddress() {
    return this.httpClient.get('https://api.ipify.org/?fromat=json', { responseType: 'text' });
  }
}
