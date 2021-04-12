import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent implements OnInit {

  constructor() { }

  subMenus = ['Role', 'User', 'Menu', 'Test'];

  ngOnInit(): void {
  }

}
