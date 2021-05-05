import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MarketMaster } from 'src/app/models/Market/market-master.model';
import { MarketService } from 'src/app/modules/market/services/market.service';
import { EmployeeModel } from '../../models/employee.model';
import { EmployeeService } from '../../modules/employee/services/employee.service';
@Injectable()
export class AllocationListsResolver implements Resolve<MarketMaster[]> {

  pageNumber = 1;
  pageSize = 20;
  constructor(
    private marketService: MarketService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MarketMaster[]> {
    return this.marketService
      .getPaginatedAllocation(this.pageNumber, this.pageSize,null)
      .pipe(
        catchError(error => {
          this.toastr.error('Problem retrieving data');
          return of(null);
        })
      );
  }
}
