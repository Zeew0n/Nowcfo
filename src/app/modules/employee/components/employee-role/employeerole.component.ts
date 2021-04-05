import {Component, OnInit} from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal,ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DesignationModel } from 'src/app/models/designation.model';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { DesignationService } from '../../services/employeerole.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { fakeAsync } from '@angular/core/testing';

@Component({
  selector: 'app-employeerole',
  styleUrls: ['employeerole.component.scss'],
  templateUrl: './employeerole.component.html',
})
export class EmployeeRoleComponent implements OnInit {
  designation: DesignationModel = new DesignationModel();
  designations: DesignationModel[];

  isSubmitting: boolean; // Form submission variable
  closeResult = ''; // close result for modal
  submitted = false;

  // designationId: number;
  isEdit = false;
  isUpdate = false;

  selectemployeerole;
  selectedDesignationId: number;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private designationService: DesignationService,
    private route: ActivatedRoute,
    private ngxLoader: NgxUiLoaderService
  ) {}


  //For TreeView Checklist

  items: TreeviewItem[] = [];

  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 400,
  });


  /* Form Declarations */
  designationForm: FormGroup;
  EventValue: any = 'Save';

  designationId = new FormControl('');
  designationName = new FormControl('', [Validators.required]);
  isActive = new FormControl(true);

  ngOnInit() {
    this.getRoles();
    this.initializeEmployeeRoleForm();
  }

  getRoles() {
    this.designationService.GetAllRoles().subscribe(
      (result) => {
        this.designations = result;
      },
      (error) => console.error
    );
  }

  initializeEmployeeRoleForm() {
    this.designationForm = new FormGroup({
      designationId: this.designationId,
      designationName: this.designationName,
      isActive: this.isActive
    });
  }
  openDeleteModal(content, id) {
    this.EventValue = 'Delete';
    this.selectedDesignationId = id;
    this.openModal(content);
  }


  Delete() {
    this.ngxLoader.start();
    this.designationService.DeleteDesignation(this.selectedDesignationId).subscribe(
      (result) => {
        if (result == null) {
          this.modalService.dismissAll();
          this.toastr.success('Role deleted successfully.', 'success!');
          this.getRoles();
        } else {
          this.toastr.success('something went wrong.', 'error!');
        }
        this.ngxLoader.stop();
      },
      (error) => {
        console.log(error.errorMessage);
        this.toastr.error('Cannot delete role', 'error!');
        this.ngxLoader.stop();
      }
    );
  }
  open(content) {
    this.isUpdate = false;
    this.resetFrom();
    this.isEdit = false;
    this.designation = null;
    this.openModal(content);
  }

  onSubmit() {
    this.ngxLoader.start();
    const createForm = this.designationForm.value;
    console.log(createForm);

    if (!this.isEdit) {
      if (this.designationForm.valid) {
        const model = new DesignationModel();

        model.designationName = createForm.designationName;
        model.isActive = createForm.isActive ? true : false;
        this.designationService.CreateDesignation(model).subscribe(
          (res) => {
            this.submitted = true;
            this.toastr.success('Designation Added Successfully.', 'Success!');
            this.modalService.dismissAll();
            this.getRoles();
            this.ngxLoader.stop();
          },
          (error) => {
            console.log(error);
            this.isSubmitting = false;
            this.modalService.dismissAll();
            this.toastr.error(error.error.errorMessage, 'Error!');
            this.ngxLoader.stop();
          }
        );
      }
    } else {

      if (this.designationForm.valid) {

     const model = new DesignationModel();

     model.designationName = createForm.designationName;
     model.isActive = createForm.isActive;
     model.id = this.selectemployeerole.designationId;
     this.designationService.UpdateDesignation(model.id, model).subscribe(
        (res) => {
          this.toastr.success('Designation Updated Successfully.', 'Success!');
          this.modalService.dismissAll();
          this.getRoles();
          this.ngxLoader.stop();
        },
        (error) => {
          this.toastr.error(
            error.error.errorMessage !== undefined
              ? error.error.errorMessage
              : 'designation Update failed',
            'Error!'
          );
          this.ngxLoader.stop();
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
    this.designationForm.reset();
    this.EventValue = 'Save';
    this.submitted = false;
    this.designation = null;
  }

  EditData(content, designation: any) {
    this.isUpdate = true;
    this.isEdit = true;
    this.selectemployeerole = designation;
    console.log(designation);
    this.EventValue = 'Update';
    this.designationForm.patchValue({
      designationName: designation.designationName,
      designationId: designation.designationId,
      isActive:designation.isActive
    });
    this.openModal(content);
  }


  onFilterChange(value: string): void {
    console.log('filter:', value);
  }


  openModal(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'modal-cfo',
        backdropClass: 'static',
        backdrop: false
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
