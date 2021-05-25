import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AllocationTypeModel } from 'src/app/models/Market/allocation.model';
import { CogsTypeModel } from 'src/app/models/Market/cogs.model';
import { MarketAllocationModel } from 'src/app/models/Market/market-allocation.model';
import { MarketMasterModel } from 'src/app/models/Market/market-master.model';
import { OrganizationAllocation } from 'src/app/models/Market/market.model';
import { OtherTypeModel } from 'src/app/models/Market/other.model';
import { RoleService } from 'src/app/modules/user-account/services/userrole.service';
import { CreateMarketService } from '../../services/create-market.service';
import { MarketService } from '../../services/market.service';

@Component({
  selector: 'app-view-market-allocation',
  templateUrl: './view-market-allocation.component.html',
  styleUrls: ['./view-market-allocation.component.scss']
})
export class ViewMarketAllocationComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private roleService: RoleService,
    private ngxLoaderService: NgxUiLoaderService,
    private location: Location,
    private router: Router,
    private _route: ActivatedRoute,
    private createMarketSerivce: CreateMarketService,
    private marketService: MarketService
  ) { 
  }

  marketMasterForm: FormGroup;
  allocationtList: FormArray;
  organizationAllocation:OrganizationAllocation;
  allocationTypes:AllocationTypeModel[];
  cogsTypes:CogsTypeModel[];
  otherTypes:OtherTypeModel[];
  market:MarketMasterModel;
  marketAllocations: MarketAllocationModel[];
  parentOrganizationId = '';

  ngOnInit(): void {
    this._route.queryParamMap.subscribe((queryParams) => {
      if (queryParams.has('id')) {
        this.parentOrganizationId = queryParams.get('id');
      } 
    });
    this.getOrganiztionMarkets();
    this.getAllocationTypes();
    this.getCogsTypes();
    this.getOtherTypes();
  }

  getOrganiztionMarkets(){
    this.createMarketSerivce.getAllMarketsByOrgId(this.parentOrganizationId)
    .subscribe(
      (data) => {
        this.organizationAllocation = new OrganizationAllocation();
        this.organizationAllocation.organizationName  =data.organizationName;
        this.organizationAllocation.markets=data.markets

      },
      (err) => {
        this.toastr.error('err', 'error!');
      }
    )

  }

  getAllocationTypes() {
    this.createMarketSerivce.getAllAllocationTypes().subscribe(
      (data)=>{
        this.allocationTypes = data;
      },
      (err)=>{
        console.log(err);
      }
    )
  }

  getCogsTypes() {
    this.createMarketSerivce.getAllCogsType().subscribe(
      (data)=>{
        this.cogsTypes = data;
      },
      (err)=>{
        console.log(err);
      }
    )
  }

  getOtherTypes() {
    this.createMarketSerivce.getAllOtherTypes().subscribe(
      (data)=>{
        this.otherTypes = data;
      },
      (err)=>{
        console.log(err);
      }
    )
  }
}
