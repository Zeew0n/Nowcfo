import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import AuthenticationService from 'src/app/modules/user-account/services/authentication.service';

@Component({
    selector: 'app-top-nav',
    templateUrl: './top-nav.component.html',
    styleUrls: ['./top-nav.scss']
})

export class TopNavComponent implements OnInit  {
  userName :string;
    constructor(
      private router: Router,
      private authService:AuthenticationService
    ) {}

  ngOnInit(): void {
    this.userName= this.authService.getUserName();
  }


    onLogOut() {
      this.clearLocalStorage();
    }

    private  clearLocalStorage() {
        localStorage.clear();
        this.router.navigate(['/']);
      }
}
