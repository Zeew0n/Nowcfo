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
@Component({
  selector: 'app-organization-list',
  styleUrls: ['organization.component.scss'],
  templateUrl: './organization.component.html',
})
export class OrganizationComponent implements OnInit {
  organization: OrganizationModel = new OrganizationModel();
  organizations: OrganizationModel[];
  orgList;
  empList;

  closeResult = ''; // close result for modal
  submitted = false;
  isEdit = false;

  selectorganization;
  selectedOrgId;
  orgEmployees;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private organizationService: OrganizationService,
    private route: ActivatedRoute,
    private navigationService: NavigationService
  ) {
    this.route.params.subscribe((params) => {
      if ( params.id !== undefined) {
      this.selectedOrgId = params.id;
      this.getEmployeeList();
     // alert("mike check");
      }
    });
  }

  /* Form Declarations */
  OrganizationForm: FormGroup;
  EventValue: any = 'Save';

  ngOnInit() {
    //  this.UserForm.controls.password.setValidators(null);
    if (!this.selectedOrgId) {
      this.getOrganizations();
    }
    this.initializeorganizationForm();
  }

  initializeorganizationForm() {
    this.OrganizationForm = new FormGroup({
      organizationId: new FormControl(''),
      organizationName: new FormControl('', [Validators.required]),
      hasParent: new FormControl(''),
      parentOrganizationId: new FormControl(''),
    });
  }

  getOrganizations() {
    this.organizationService.GetAllOrganizations().subscribe(
      (result) => {
        this.orgList = true;
        this.empList = false;
        this.organizations = result;
      },
      (error) => console.error
    );
  }

  openDeleteModal(content, id) {
    this.EventValue = 'Delete';
    this.selectedOrgId = id;
    this.openModal(content);
  }

  Delete() {
    this.organizationService.DeleteOrganization(this.selectedOrgId).subscribe(
      (result) => {
        if (result == null) {
          this.modalService.dismissAll();
          this.toastr.success('organization delete successfully.', 'success!');
          this.getOrganizations();
        } else {
          this.toastr.success('something went wrong.', 'error!');
        }
      },
      (error) => {
        console.log(error.errorMessage);
        this.toastr.error('Cannot delete Parent Organization', 'error!');
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
    const createForm = this.OrganizationForm.value;
    console.log(createForm);
    if (!this.isEdit) {
      if (this.OrganizationForm.valid) {
        const model = new OrganizationModel();

        model.organizationName = createForm.organizationName;
        model.hasParent = createForm.hasParent;
        model.parentOrganizationId = createForm.parentOrganizationId;
        this.submitted = true;

        this.organizationService.CreateOrganization(model).subscribe(
          (res) => {
            this.submitted = false;
            this.toastr.success('User Added Successfully.', 'Success!');
            this.modalService.dismissAll();
            this.getOrganizations();
          },
          (error) => {
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
        this.organizationService.UpdateOrganization(model.id, model).subscribe(
          (res) => {
            this.toastr.success(
              'Organization Updated Successfully.',
              'Success!'
            );
            this.modalService.dismissAll();
            this.getOrganizations();
          },
          (error) => {
            this.toastr.error(
              error.error.errorMessage !== undefined
                ? error.error.errorMessage
                : 'Organization Update failed',
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
    this.OrganizationForm.reset();
    this.OrganizationForm.controls.parentOrganizationId.clearValidators();
    this.EventValue = 'Save';
    this.submitted = false;
    this.organization = null;
  }

  openEditModal(content, organization: any) {
    this.isEdit = true;
    this.selectorganization = organization;
    console.log(organization);
    this.EventValue = 'Update';
    this.OrganizationForm.patchValue({
      OrganizationId: organization.OrganizationId,
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
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'modal-cfo',
    });
  }

  openModal(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
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
}
