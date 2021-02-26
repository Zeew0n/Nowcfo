import {Component} from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal,ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import AuthenticationService from '../../user-account/services/authentication.service';
import { OrganizationService } from '../services/organization.service';
import { OrganizationModel } from 'src/app/models/organization.model';
@Component({
  selector: 'app-organization-list',
  styleUrls: ['organization.component.scss'],
  templateUrl: './organization.component.html',
})
export class OrganizationComponent {
  organization: OrganizationModel = new OrganizationModel();
  organizations: OrganizationModel[];

  isSubmitting: boolean; // Form submission variable
  closeResult = ''; // close result for modal
  submitted = false;

  // organizationId: number;
  isEdit = false;
  isUpdate = false;

  selectorganization;
  selectedOrgId: number;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private organizationService: OrganizationService,

    private authService: AuthenticationService,
    private route: ActivatedRoute
  ) {}

  /* Form Declarations */
  OrganizationForm: FormGroup;
  EventValue: any = 'Save';

  organizationId = new FormControl('');
  organizationName = new FormControl('', [Validators.required]);
  isHeadOrganization = new FormControl();
  parentOrganizationId = new FormControl();

  ngOnInit() {
    //  this.UserForm.controls.password.setValidators(null);
    this.getOrganizations();
    this.initializeorganizationForm();
  }

  getOrganizations() {
    this.organizationService.GetAllOrganizations().subscribe(
      (result) => {
        this.organizations = result;
      },
      (error) => console.error
    );
  }

  initializeorganizationForm() {
    this.OrganizationForm = new FormGroup({
      organizationId: this.organizationId,
      organizationName: this.organizationName,
      isHeadOrganization: this.isHeadOrganization,
      parentOrganizationId: this.parentOrganizationId,
    });
  }
  openDeleteModal(content, id) {
    this.EventValue = 'Delete';
    this.selectedOrgId = id;
    this.openModal(content);
  }

  Delete() {
    this.organizationService.DeleteEntity(this.selectedOrgId).subscribe(
      (result) => {
        if (result == null) {
          this.modalService.dismissAll();
          this.toastr.success(
            'organization delete successfully.',
            'success!'
          );
          this.getOrganizations();
        } else {
          this.toastr.success('something went wrong.', 'error!');
        }
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error.errormessage, 'error!');
      }
    );
  }

  open(content) {
    this.isUpdate = false;
    this.resetFrom();
    this.isEdit = false;
    this.organization = null;
    this.openModal(content);
  }

  onSubmit() {
    const createForm = this.OrganizationForm.value;
    console.log(createForm);

    if (!this.isUpdate) {
      if (this.OrganizationForm.valid) {
        const model = new OrganizationModel();

        model.organizationName = createForm.organizationName;
        model.isHeadOrganization = createForm.isHeadOrganization;
        model.parentOrganizationId = createForm.parentOrganizationId;

        this.organizationService.CreateOrganization(model).subscribe(
          (res) => {
            this.submitted = true;
            this.toastr.success('User Added Successfully.', 'Success!');
            this.modalService.dismissAll();
            this.getOrganizations();
          },
          (error) => {
            console.log(error);
            this.isSubmitting = false;
            this.modalService.dismissAll();
            this.toastr.error(error.error.errorMessage, 'Error!');
          }
        );
      }
    } else {

     const model = new OrganizationModel();

     model.parentOrganizationId = createForm.parentOrganizationId;
     model.organizationName = createForm.organizationName;
     model.isHeadOrganization = createForm.isHeadOrganization;
     model.id = this.selectorganization.organizationId;
     this.organizationService.UpdateOrganization(model.id, model).subscribe(
        (res) => {
          this.toastr.success('Organization Updated Successfully.', 'Success!');
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

  private getDismissReason(reason: any): string {
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
    this.EventValue = 'Save';
    this.submitted = false;
    this.organization = null;
  }

  EditData(content, organization: any) {
    this.isUpdate = true;
    this.isEdit = true;
    this.selectorganization = organization;
    console.log(organization);
    this.EventValue = 'Update';
    this.OrganizationForm.patchValue({
      organizationName: organization.organizationName,
      isHeadOrganization: organization.isHeadOrganization,
      parentOrganizationId: organization.parentOrganizationId,
      OrganizationId: organization.OrganizationId,
    });
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'modal-cfo',
    });
  }

  private openModal(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'modal-cfo',
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
