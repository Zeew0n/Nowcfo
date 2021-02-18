import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-top-nav',
    templateUrl: './top-nav.component.html',
    styleUrls: ['./top-nav.scss']
})

export class TopNavComponent {
    constructor(
      private router: Router,
    ) {}

    onLogOut() {
      this.clearLocalStorage();
    }

    private  clearLocalStorage() {
        localStorage.clear();
        this.router.navigate(['/']);
      }
}
