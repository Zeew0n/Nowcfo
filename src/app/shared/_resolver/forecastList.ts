import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SalesForecastModel } from 'src/app/models/SalesForecast/sales-forecast.model.';
import { SalesForecastService } from 'src/app/modules/sales-forecast/services/sales-forecast.service';
import { EmployeeModel } from '../../models/employee.model';
import { EmployeeService } from '../../modules/employee/services/employee.service';
@Injectable()
export class ForecastListsResolver implements Resolve<SalesForecastModel[]> {

  pageNumber = 1;
  pageSize = 20;
  constructor(
    private forecastService: SalesForecastService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SalesForecastModel[]> {
    return this.forecastService
      .getPaginatedForecast(this.pageNumber, this.pageSize)
      .pipe(
        catchError(error => {
          this.toastr.error('Problem retrieving data');
          return of(null);
        })
      );
  }
}
