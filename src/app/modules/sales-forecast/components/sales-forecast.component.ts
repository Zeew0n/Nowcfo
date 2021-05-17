

  import { Component, OnInit, Output, EventEmitter } from '@angular/core';

  import {
    FormControl,
    FormGroup,
    Validators,
  } from '@angular/forms';
  
  import { NgbModal,NgbDateStruct, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
  import { ToastrService } from 'ngx-toastr';
  import { ActivatedRoute, Data } from '@angular/router';
  import {
    PaginatedResult,
    Pagination,
  } from 'src/app/models/Pagination/Pagination';
import { SalesForecastModel } from 'src/app/models/SalesForecast/sales-forecast.model.';
import { SalesForecastService } from '../services/sales-forecast.service';
import { DatePipe } from '@angular/common'
  const now = new Date();
  @Component({
    selector: 'app-sales-forecast',
    templateUrl: './sales-forecast.component.html',
    styleUrls: ['./sales-forecast.component.scss']
  })
  export class SalesForecastComponent implements OnInit {
    forecast: SalesForecastModel = new SalesForecastModel();
    forecasts: SalesForecastModel[];

    disabled = false;
    isView=false;
    disableSelect = true;
    isPayPeriodExists=false;
    id = '';
    closeResult = ''; // close result for modal
    submitted = false;
    isEdit = false;
    selectforecast;
    selectedForecastId: string;
    pagination: Pagination;

    
      minDate: NgbDateStruct = {
        year: now.getFullYear()-17,
        month: now.getMonth(),
        day: now.getDate(),
      };
      minEndDate: NgbDateStruct = {
        year: this.minDate.year,
        month: this.minDate.month,
        day: this.minDate.day + 1,
      };
  
  
  
    constructor(
      private modalService: NgbModal,
      private toastr: ToastrService,
      private forecastService: SalesForecastService,
      private route: ActivatedRoute,
      private datepipe: DatePipe
    ) {}
  
  
    forecastForm: FormGroup;
    EventValue: any = 'Save';
  


    payPeriod = new FormControl('', [Validators.required]);
    billRate = new FormControl('', [Validators.required,Validators.pattern(/^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/
      )]);
    billHours = new FormControl('', [Validators.required,Validators.pattern(/^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/
      )]);
    placements = new FormControl('', [Validators.required,Validators.pattern(/^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/
      )]);
    buyOuts = new FormControl('', [Validators.required,Validators.pattern(/^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/
      )]);
    estimatedRevenue = new FormControl('', [Validators.required]);
    cogs = new FormControl('', [Validators.required,Validators.pattern(/^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/
      )]);
    cogsQkly = new FormControl('', [Validators.required]);
    closedPayPeriods = new FormControl('', [Validators.required,Validators.pattern(/^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/
      )]);
    otherPercent = new FormControl('', [Validators.required,Validators.pattern(/^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/
      )]);  

  
    ngOnInit() {

      this.route.data.subscribe((data: Data) => {
        this.forecasts = data.forecasts.result;
        this.pagination = data.forecasts.pagination;
      });
      this.initializeforecastForm();

    }
  

  onValueChange(){
   const value1 = this.forecastForm.value.billRate;
   const value2 = this.forecastForm.value.billHours;
  if(value1 && value2){
    const revenue = (value1*value2*1.03).toFixed(2);
    this.estimatedRevenue.patchValue(revenue);
    const value3 = (this.forecastForm.value.estimatedRevenue*0.5).toFixed(2);
    this.cogsQkly.patchValue(value3);
  }
  };



  getForecasts() {
    this.forecastService
      .getPaginatedForecast(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,

      )
      .subscribe(
        (res: PaginatedResult<SalesForecastModel[]>) => {
          this.forecasts = res.result;
          this.pagination = res.pagination;
        },
        (error) => {
          this.toastr.error(error);
        }
      );
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.getForecasts();
  }



     checkPayrollExists() {
      this.isPayPeriodExists = false;
       var payPeriod= this.forecastForm.value.payPeriod;
       payPeriod = this.setPayDate(payPeriod);
       let latestdate=this.datepipe.transform(payPeriod, 'yyyy-MM-dd')
      this.forecastService.checkPayPeriodExists(latestdate).subscribe(
        () => {
          this.isPayPeriodExists = true;
          this.forecastForm.controls.payPeriod.setErrors({


            
          })
        },
        () => console.error
      );
    }


    // getAllForecasts() {
    //   this.forecastService.getAllForecasts().subscribe(
    //     (result) => {
    //       this.forecasts = result;
    //     },
    //     () => console.error
    //   );
    // }
  
  
  
      /**
     * Set date
     */
       setDate(date) {
        if (date) {
          const parsedDate = date
            ? new Date('' + date.year + '/' + date.month + '/' + date.day)
            : null;
          return parsedDate.toLocaleDateString();
        }
      }
    

      setPayDate(date) {
        if (date) {
          const parsedDate = date
            ? new Date('' + date.year + '-' + date.month + '-' + date.day)
            : null;
          return parsedDate.toLocaleDateString();
        }
      }


      /**
       * Get Parsed date
       */
      setNgbDate(date) {
        if (date) {
          const signDate: string = date.substring(0, 10);
          if (signDate.includes('-') || signDate.includes('/')) {
            let newDate = {} as any;
            let ngbDate = {} as any;
            if (signDate.includes('-')) {
              newDate = signDate.split('-');
              ngbDate = {
                year: Number(newDate[0]),
                month: Number(newDate[1]),
                day: Number(newDate[2]),
              };
            } else {
              newDate = signDate.split('/');
              ngbDate = {
                month: Number(newDate[0]),
                day: Number(newDate[1]),
                year: Number(newDate[2]),
              };
            }
            return ngbDate;
          }
        }
      }

    initializeforecastForm() {  
      this.forecastForm = new FormGroup({
        payPeriod:this.payPeriod,
        billRate:this.billRate,
        billHours:this.billHours,
        placements:this.placements,
        buyOuts:this.buyOuts,
        estimatedRevenue:this.estimatedRevenue,
        cogs:this.cogs,
        cogsQkly:this.cogsQkly,
        closedPayPeriods:this.closedPayPeriods,
        otherPercent:this.otherPercent,
  
      });
    }
  

    EditData(content, id: string) {
      this.isEdit = true;
      this.isView=false;
      this.selectedForecastId = id;
      this.resetFrom();
      this.EventValue = 'Update';
      this.id = id;
      this.getForecastById(id, content);
      this.forecastForm.enable();

    }

    ViewData(content, id: string) {
      this.isEdit=false;
      this.isView = true;
      this.selectedForecastId = id;
      this.id = id;
      this.getForecastById(id, content);
      this.forecastForm.disable();

    }
  
    private displayFormData(data: SalesForecastModel, id: any) {
  
      this.forecastForm.patchValue({
        payPeriod: this.setNgbDate(data.payPeriod),
        billRate: data.billRate,
        billHours: data.billHours,
        placements: data.placements,
        buyOuts: data.buyOuts,
        estimatedRevenue: data.estimatedRevenue,
        cogs: data.cogs,
        cogsQkly: data.cogsQkly,
        closedPayPeriods: data.closedPayPeriods,
        otherPercent: data.otherPercent,
  
      
      });
    }
  
    getForecastById(id: string, content) {
      this.forecastService.getForecastById(id).subscribe(
        (res: SalesForecastModel) => {
          this.displayFormData(res, id);
          this.openModal(content);
        },
        (error) => {
          this.toastr.error(
            error.error.errorMessage !== undefined
              ? error.error.errorMessage
              : 'Unable to retrieve data',
            'Error!'
          );
        }
      );
    }
  
    openDeleteModal(content, id) {
      this.EventValue = 'Delete';
      this.selectedForecastId = id;
      this.openModal(content);
    }
  
    Delete() {
      this.forecastService.deleteForecast(this.selectedForecastId).subscribe(
        (result) => {
          if (result == null) {
            this.modalService.dismissAll();
            this.toastr.success('Forecast deleted successfully.', 'success!');
            this.getForecasts();
          } else {
            this.toastr.success('something went wrong.', 'error!');
          }
        },
        (error) => {
          console.log(error.errorMessage);
          this.toastr.error('Cannot delete Forecast', 'error!');
        }
      );
    }
    open(content) {
      this.resetFrom();
      this.isEdit = false;
      this.isView=false;
      this.openModal(content);
    }
  

  
    onSubmit() {
      const createForm = this.forecastForm.value;
      if (!this.isEdit) {
        if (this.forecastForm.valid) {
          const model = {
            payPeriod: this.setDate(createForm.payPeriod),
            billRate: createForm.billRate,
            billHours: createForm.billHours,
            placements: createForm.placements,
            buyOuts: createForm.buyOuts,
            estimatedRevenue: createForm.estimatedRevenue,
            cogs: createForm.cogs,
            cogsQkly: createForm.cogsQkly,
            closedPayPeriods: createForm.closedPayPeriods,
            otherPercent: createForm.otherPercent,
          };

          this.forecastService.createForecast(model).subscribe(
            () => {
              this.submitted = true;
              this.toastr.success('Forecast Added Successfully.', 'Success!');
              this.modalService.dismissAll();
              this.getForecasts();
            },
            (error) => {
              this.modalService.dismissAll();
              this.toastr.error(error.error.errorMessage, 'Error!');
            }
          );
        }
      } else {
        if (this.forecastForm.valid) {
          const model = {
            payPeriod: this.setDate(createForm.payPeriod),
            billRate: createForm.billRate,
            billHours: createForm.billHours,
            placements: createForm.placements,
            buyOuts: createForm.buyOuts,
            estimatedRevenue: createForm.estimatedRevenue,
            cogs: createForm.cogs,
            cogsQkly: createForm.cogsQkly,
            closedPayPeriods: createForm.closedPayPeriods,
            otherPercent: createForm.otherPercent,
  
  
          };
  
          this.id = this.selectedForecastId;
  
          this.forecastService.updateForecast(this.id, model).subscribe(
            () => {
              this.toastr.success('Forecast Updated Successfully.', 'Success!');
              this.modalService.dismissAll();
              this.getForecasts();
            },
            (error) => {
              this.toastr.error(
                error.error.errorMessage !== undefined
                  ? error.error.errorMessage
                  : 'Forecast Update failed',
                'Error!'
              );
            }
          );
        }
      }
    }
  
    getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return `with: ${reason}`;
      }
    }
  
    resetFrom() {
      this.forecastForm.reset();
      this.EventValue = 'Save';
      this.submitted = false;
      this.isView=false;
      this.forecastForm.enable();
      this.isPayPeriodExists = false;

    }
  
  
    openModal(content: any) {
      this.modalService
        .open(content, {
          ariaLabelledBy: 'modal-basic-title',
          windowClass: 'modal-cfo',
          backdropClass: 'static',
          backdrop: false,
  
        })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }
  }
  