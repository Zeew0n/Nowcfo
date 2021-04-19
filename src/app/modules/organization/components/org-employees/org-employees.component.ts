import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-org-employees',
  templateUrl: './org-employees.component.html',
  styleUrls: ['./org-employees.component.scss']
})
export class OrgEmployeesComponent implements OnInit {
  @Input() orgList;
  constructor() {
    this.orgList;
    console.log(this.orgList);
   }

  ngOnInit(): void {
  }

}
