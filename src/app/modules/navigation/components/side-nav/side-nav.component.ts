import { Component, EventEmitter, Output } from '@angular/core';
import { OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { OrganizationNavModel } from 'src/app/models/OrganizationNavModel';

import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { EmployeeModel } from 'src/app/models/employee.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./sidebar.scss'],
})
export class SideNavComponent implements OnInit {
  constructor(
    private navigationService: NavigationService,
    private router: Router
  ) {}

  expandOrgNav = false;

  menus = ['org roles', 'employee management', 'org manager'];

  admins = ['admin', 'users', 'portal settings'];

  organizations: OrganizationNavModel[];

  // employees:EmployeeModel[];
  employees: any[] = [];

  items: TreeviewItem[] = [];

  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 400,
  });

  ngOnInit() {}

  toggleOrganizationNav(menu) {
    const mainTag = document.getElementById('mainTag') as any;

    if (menu === 'org manager') {
      this.expandOrgNav = !this.expandOrgNav;
      this.getOrganizatioNavigation();
      this.router.navigateByUrl('organization-information');
      if (!mainTag.classList.contains('main-content-slide')) {
        mainTag.classList.add('main-content-slide');
      } else {
        mainTag.classList.remove('main-content-slide');
      }
    }
    if (menu === 'employee management') {
      this.expandOrgNav = false;
      if (mainTag.classList.contains('main-content-slide')) {
        mainTag.classList.remove('main-content-slide');
      }
      this.router.navigateByUrl('employee-information');
    }
    if (menu === 'org roles') {
      this.expandOrgNav = false;
      if (mainTag.classList.contains('main-content-slide')) {
        mainTag.classList.remove('main-content-slide');
      }
      this.router.navigateByUrl('emp-roles');
    }
  }

  getOrganizatioNavigation() {
    this.navigationService.getOrganizationNavigation().subscribe(
      (res: TreeviewItem[]) => {
        this.items.length = 0;
        res.forEach((data) => {
          const item = new TreeviewItem({
            text: data.text,
            value: data.value,
            collapsed: true,
            children: data.children,
          });
          this.items.push(item);
          console.log('Data', this.items);
        });
      },
      (error) => console.error(error)
    );
  }

  onValueChange(orgId) {
    this.router.navigateByUrl(`organization-information/${orgId}`);
    // const data = this.items.find((x) => x.value === orgId);
    // if (data) {
    //   this.items.find((x) => x.value === orgId).collapsed = !data.collapsed;
    //   console.log(orgId);
    // }
    // debugger;
    //  this.navigationService.getEmployeesByOrganizationId(orgId).subscribe(
    //   (res)=>{
    //     this.employees = res
    //   },(err)=>{

    //   }
    // );
  }
}
