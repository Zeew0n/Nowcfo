import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EmployeeService } from 'src/app/modules/employee/services/employee.service';
import { NavigationService } from 'src/app/modules/navigation/services/navigation.service';
import { OrganizationService } from 'src/app/modules/organization/services/organization.service';
import { AdminUserService } from '../../services/admin-user.service';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent implements OnInit {

  constructor(
    private adminUserService: AdminUserService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private organizationService: OrganizationService,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private employeeService: EmployeeService,
    private ngxLoaderService: NgxUiLoaderService,
    private router: Router,
  ) { }
  childMenus: any ;
  parentMenuId = '';

  ngOnInit(): void {
    this.parentMenuId = this.route.snapshot.queryParamMap.get('menuId');
    console.log(this.parentMenuId);
    this.adminUserService.getChildMenus(this.parentMenuId)
     .subscribe(
       (res) => {
          this.childMenus = res;
          console.log(res);
       },
       (err) => {
       }
     );
  }

  navigateChild(url: string){
    this.router.navigateByUrl(url);
  }

}
