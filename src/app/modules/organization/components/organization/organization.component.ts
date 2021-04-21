import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationModel } from 'src/app/models/organization.model';
import { OrganizationService } from '../../services/organization.service';
import AuthenticationService from 'src/app/modules/user-account/services/authentication.service';
import { NavigationService } from 'src/app/modules/navigation/services/navigation.service';
import { EmployeeService } from 'src/app/modules/employee/services/employee.service';
import { EmployeeModel } from 'src/app/models/employee.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-organization-list',
  styleUrls: ['organization.component.scss'],
  templateUrl: './organization.component.html',
})
export class OrganizationComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private organizationService: OrganizationService,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private employeeService: EmployeeService,
    private ngxLoaderService: NgxUiLoaderService,
  ) {
    this.route.params.subscribe((params) => {
      if (params.id !== undefined) {
        this.selectedOrgId = params.id;
        this.getSingleOrganization(params.id);
        this.getEmployeeList();
      }
    });
  }
  organization: OrganizationModel = new OrganizationModel();
  organizations: OrganizationModel[];
  employeeList: EmployeeModel[];
  employee: EmployeeModel;
  orgList;
  empList;

  closeResult = ''; // close result for modal
  loadingIcon = false;
  submitted = false;
  isEdit = false;

  selectorganization;
  selectedOrgId;
  orgEmployees;

  /* Form Declarations */
  OrganizationForm: FormGroup;
  employeeAssignForm: FormGroup;
  EventValue: any = 'Save';
  oldValue = '';
  timeOutVariable: any;

  ngOnInit() {
    this.getOrganizations();
    this.initializeorganizationForm();
    this.initializeEmployeeAssignForm();
  }

  initializeorganizationForm() {
    this.OrganizationForm = new FormGroup({
      organizationId: new FormControl(''), // you can remove orgId
      organizationName: new FormControl('', [Validators.required]),
      hasParent: new FormControl(''),
      parentOrganizationId: new FormControl(''),
    });
  }

  initializeEmployeeAssignForm() {
    this.employeeAssignForm = this.fb.group({
      employeeId: [null, [Validators.required]],
    });
  }

  getOrganizations() {
    this.organizationService.getAllOrganizations().subscribe(
      (result) => {
        this.orgList = true;
        this.empList = false;
        this.organizations = result;
      },
      (error) => console.error
    );
  }

  // getOrganizationOnChange() {
  //   this.organizationService.getEmp()
  //   .subscribe(
  //     (res) => {
  //       this.organizations = result;
  //     },
  //     (err) => {
  //       this.organizations = result;
  //     }
  //   )
  // }

  openDeleteModal(content, id) {
    this.EventValue = 'Delete';
    this.selectedOrgId = id;
    this.openModal(content);
  }

  Delete() {
    this.ngxLoaderService.start();
    this.organizationService.deleteOrganization(this.selectedOrgId).subscribe(
      (result) => {
        if (result == null) {
          this.modalService.dismissAll();
          this.toastr.success('organization delete successfully.', 'success!');
          this.getOrganizations();
        } else {
          this.toastr.success('something went wrong.', 'error!');
        }
        this.ngxLoaderService.stop();
      },
      (error) => {
        console.log(error.errorMessage);
        this.toastr.error('Cannot delete Parent Organization', 'error!');
        this.ngxLoaderService.stop();
      }
    );
  }

  employeeAssignSubmit(){
    this.ngxLoaderService.start();
    const employeeAssign = this.employeeAssignForm.value;
    const employee = new EmployeeModel();
    employee.organizationId = this.selectedOrgId;
    employee.employeeId = employeeAssign.employeeId;
    this.employeeService
        .assignEmployee(employee)
        .subscribe(
          (res) => {
            this.submitted = true;
            this.toastr.success('Employee Assigned to Organization Successfully.', 'Success!');
            this.modalService.dismissAll();
            this.ngxLoaderService.stop();
          },
          (err) => {
            console.log(err);
            this.submitted = false;
            this.modalService.dismissAll();
            this.toastr.error(err.error.errorMessage, 'Error!');
            this.ngxLoaderService.stop();
          }
        );
  }

  openCreateModal(content) {
    this.resetFrom();
    this.isEdit = false;
    this.organization = null;
    this.openModal(content);
  }

  checkValue(event: any): void {
    if (event.target.checked) {
      this.OrganizationForm.controls.parentOrganizationId.setValidators([
        Validators.required,
      ]);
    } else {
      this.OrganizationForm.controls.parentOrganizationId.setValidators([]);
    }
    this.OrganizationForm.controls.parentOrganizationId.updateValueAndValidity();
  }

  onSubmit() {
    this.ngxLoaderService.start();
    const createForm = this.OrganizationForm.value;
    console.log(createForm);
    if (!this.isEdit) {
      if (this.OrganizationForm.valid) {
        const model = new OrganizationModel();

        model.organizationName = createForm.organizationName;
        model.hasParent = createForm.hasParent;
        model.parentOrganizationId = createForm.parentOrganizationId;
        this.submitted = true;

        this.organizationService.createOrganization(model).subscribe(
          (res) => {
            this.submitted = false;
            this.toastr.success('User Added Successfully.', 'Success!');
            this.modalService.dismissAll();
            this.getOrganizations();
            this.ngxLoaderService.stop();
          },
          (error) => {
            this.ngxLoaderService.stop();
            console.log(error);
            this.submitted = false;
            this.modalService.dismissAll();
            this.toastr.error(error.error.errorMessage, 'Error!');
          }
        );
      }
    } else {
      if (this.OrganizationForm.valid) {
        const model = new OrganizationModel();

        model.organizationName = createForm.organizationName;
        model.hasParent = createForm.hasParent;
        model.id = this.selectorganization.organizationId;
        if (model.hasParent) {
          model.parentOrganizationId = createForm.parentOrganizationId;
        }
        this.organizationService.updateOrganization(model.id, model).subscribe(
          (res) => {
            this.toastr.success(
              'Organization Updated Successfully.',
              'Success!'
            );
            this.modalService.dismissAll();
            this.getOrganizations();
            this.ngxLoaderService.stop();
          },
          (error) => {
            this.toastr.error(
              error.error.errorMessage !== undefined
                ? error.error.errorMessage
                : 'Organization Update failed',
              'Error!'
            );
            this.ngxLoaderService.stop();
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
    this.OrganizationForm.reset();
    this.OrganizationForm.controls.parentOrganizationId.clearValidators();
    this.EventValue = 'Save';
    this.submitted = false;
    this.organization = null;
  }
  openAssignEmployeeModal(content, organization: OrganizationModel) {
    this.getAllEmployees();
    this.openModal(content);
  }

  openEditModal(content, organization: OrganizationModel) {
    this.isEdit = true;
    this.selectorganization = organization;
    console.log(organization);
    this.EventValue = 'Update';
    this.OrganizationForm.patchValue({
      OrganizationId: organization.organizationId,
      organizationName: organization.organizationName,
      hasParent: organization.hasParent,
      parentOrganizationId: organization.parentOrganizationId,
    });

    if (this.selectorganization.hasParent) {
      this.OrganizationForm.controls.parentOrganizationId.setValidators([
        Validators.required,
      ]);
    } else {
      this.OrganizationForm.controls.parentOrganizationId.setValidators([]);
    }

    this.OrganizationForm.controls.parentOrganizationId.updateValueAndValidity();
    this.openModal(content);
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
  getSingleOrganization(id) {
    this.organizationService.getOrganizationById(id).subscribe(
      (res) => {
        this.organization = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getEmployeeList() {
    this.navigationService
      .getEmployeesByOrganizationId(this.selectedOrgId)
      .subscribe(
        (res) => {
          console.log(res);
          this.empList = true;
          this.orgList = false;
          this.orgEmployees = res;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  searchEmployee(event) {
    this.loadingIcon = true;
    if (this.timeOutVariable) {
      clearTimeout(this.timeOutVariable);
    }
    const value = event.target.value;
    if (value === '' || event.key === 'Backspace') {
      this.timeOutVariable = setTimeout(() => this.getEmployee(value), 400);
    } else {
      this.timeOutVariable = setTimeout(() => this.getEmployee(value), 400);
    }
  }

  getSelectedEmployee(event){
  }

  getEmployee(value) {
    this.employeeService.getEmployeesBySearchValue(value).subscribe(
      (res) => {
        console.log(res);
        this.employeeList = res;
        this.loadingIcon = false;
      },
      (err) => {
        console.log(err);
        this.loadingIcon = false;
      }
    );
  }

  getAllEmployees() {
    this.employeeService.getAllEmployees().subscribe(
      (res) => {
        this.employeeList = res;
        console.clear();
        console.log(res);
      },
      (err) => {
        console.log(err);
        this.toastr.error(err);
      }
    );
  }

}
