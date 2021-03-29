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

  menus = JSON.parse(localStorage.getItem('sidemenu'));

  admins = ['admin', 'users', 'Settings'];

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

  toggleOrganizationNav(menu: string) {
    menu = menu.trim().toLowerCase();
    const mainTag = document.getElementById('mainTag') as any;
    if (menu === 'organization') {
      this.expandOrgNav = !this.expandOrgNav;
      this.getOrganizatioNavigation();
      this.router.navigateByUrl('organization-information');
      if (!mainTag.classList.contains('main-content-slide')) {
        mainTag.classList.add('main-content-slide');
      } else {
        mainTag.classList.remove('main-content-slide');
      }
    }
    if (menu === 'employee') {
      debugger;
      this.expandOrgNav = false;
      if (mainTag.classList.contains('main-content-slide')) {
        mainTag.classList.remove('main-content-slide');
      }
      this.router.navigateByUrl('employee');
    }
    if (menu === 'designation') {
      this.expandOrgNav = false;
      if (mainTag.classList.contains('main-content-slide')) {
        mainTag.classList.remove('main-content-slide');
      }
      this.router.navigateByUrl('emp-roles');
    }
    if (menu === 'user') {
      this.expandOrgNav = false;
      if (mainTag.classList.contains('main-content-slide')) {
        mainTag.classList.remove('main-content-slide');
      }
      this.router.navigateByUrl('user-information');
    }
    if (menu === 'role') {
      this.expandOrgNav = false;
      if (mainTag.classList.contains('main-content-slide')) {
        mainTag.classList.remove('main-content-slide');
      }
      this.router.navigateByUrl('user-roles');
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
