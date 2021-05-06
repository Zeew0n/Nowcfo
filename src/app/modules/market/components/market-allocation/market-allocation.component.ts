import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RoleModel } from 'src/app/models/role.model';
import { MenuModel } from 'src/app/models/menu.model';
import { RolePermissionModel } from 'src/app/models/role-permission';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {Location} from '@angular/common';
import { RoleService } from 'src/app/modules/user-account/services/userrole.service';
import { OrganizationModel } from 'src/app/models/organization.model';
import { OrganizationService } from 'src/app/modules/organization/services/organization.service';
import { MarketService } from '../../services/market.service';
import { MarketAllocationModel } from 'src/app/models/Market/market-allocation.model';
import { MarketMasterModel } from 'src/app/models/Market/market-master.model';
import { ActivatedRoute, Data } from '@angular/router';
import { PaginatedResult, Pagination } from 'src/app/models/Pagination/Pagination';
@Component({
  selector: 'app-market-allocation',
  templateUrl: './market-allocation.component.html',
  styleUrls: ['./market-allocation.component.scss']
})

export class MarketAllocationComponent implements OnInit {

  organizations: OrganizationModel[];
  allocations: MarketMasterModel[];

  pagination: Pagination;

  
  closeResult = ''; // close result for modal
  allocationForm: FormGroup;

  isEdit = false;
  isLoaded=false;
  //selectrole;
  selectedMarket: number;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private marketService:MarketService,
    private ngxLoaderService: NgxUiLoaderService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  /* Form Declarations */
  EventValue: any = 'Save';
  organizationId = new FormControl(null);

  


  ngOnInit() {
    this.getHeadOrganizations();
    this.initializeAllocationForm();
   

  }
  backClicked() {
    this.location.back();
  }

  
  
    getAllocationPagination() {
      debugger
      this.marketService
        .getPaginatedAllocation(
          1,
          20,
          this.organizationId.value,
        )
        .subscribe(
          (res: PaginatedResult<MarketMasterModel[]>) => {
            this.allocations = res.result;
            this.pagination = res.pagination;
            this.isLoaded= true;
            
          },
          (error) => {
            this.toastr.error(error);
          }
        );
    }
  
    getAllocationChanged() {
      debugger
      this.marketService
        .getPaginatedAllocation(
          this.pagination.currentPage,
          this.pagination.itemsPerPage,
          this.organizationId.value,
        )
        .subscribe(
          (res: PaginatedResult<MarketMasterModel[]>) => {
            this.allocations = res.result;
            this.pagination = res.pagination;
            this.isLoaded= true;
            
          },
          (error) => {
            this.toastr.error(error);
          }
        );
    }

    pageChanged(event: any): void {
      this.pagination.currentPage = event.page;
      this.getAllocationChanged();
    }


  getHeadOrganizations() {
    this.marketService.getAllOrganizations().subscribe(
      (result) => {
        this.organizations = result;
       // this.isLoaded= true;
      },
      () => console.error
    );
  }


  initializeAllocationForm() {
    this.allocationForm = new FormGroup({
      organizationId: this.organizationId
        });
  }

  getMarketAllocationModels(organizationId) {
    
    this.marketService.getMarketAllocationModelListByOrgId(organizationId).subscribe(
      (result) => {
        this.allocations = result;
        console.log(this.allocations);
      },
      () => console.error
    );
  }


  openDeleteModal(content, id) {
    debugger
    this.EventValue = 'Delete';
    this.selectedMarket = id;
    this.openModal(content);
  }

  delete() {
    debugger
    this.ngxLoaderService.start();
    this.marketService.deleteMarketAllocationModel(this.selectedMarket).subscribe(
      (result) => {
        if (result == null) {
          this.modalService.dismissAll();
          this.toastr.success('Market Allocation deleted successfully.', 'success!');
          this.getMarketAllocationModels(this.selectedMarket);
          this.ngxLoaderService.stop();
        } else {
          this.toastr.success('something went wrong.', 'error!');
          this.ngxLoaderService.stop();
        }
      },
      (error) => {
        console.log(error.errorMessage);
        this.toastr.error('Cannot delete market allocation', 'error!');
      }
    );
  }
  open(content) {
    this.isEdit = false;
    this.openModal(content);
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


  openModal(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        backdropClass: 'static',
        windowClass: 'modal-cfo',
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




 











