import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EmployeeModel } from '../../models/employee.model';
import { EmployeeService } from '../../modules/employee/services/employee.service';
@Injectable()
export class EmployeeListsResolver implements Resolve<EmployeeModel[]> {

  pageNumber = 1;
  pageSize = 20;
  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EmployeeModel[]> {
    return this.employeeService
      .getPaginatedEmployees(this.pageNumber, this.pageSize,null,null)
      .pipe(
        catchError(error => {
          this.toastr.error('Problem retrieving data');
          return of(null);
        })
      );
  }
}
