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
import { DesignationModel } from 'src/app/models/designation.model';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { MenuModel } from 'src/app/models/menu.model';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-menu',
  styleUrls: ['menu.component.scss'],
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  menu: MenuModel = new MenuModel();
  menus: MenuModel[];

  isSubmitting: boolean; // Form submission variable
  closeResult = ''; // close result for modal
  submitted = false;

  isEdit = false;
  isUpdate = false;

  selectmenu;
  selectedMenuId: number;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private menuService: MenuService,
    private route: ActivatedRoute
  ) {}



  /* Form Declarations */
  menuForm: FormGroup;
  EventValue: any = 'Save';

  menuId = new FormControl('');
  menuName = new FormControl('', [Validators.required]);
  routeUrl = new FormControl('', [Validators.required]);
  isActive = new FormControl(true);

  ngOnInit() {
    this.getMenu();
    this.initializeEmployeeRoleForm();
  }

  getMenu() {
    this.menuService.GetAllMenus().subscribe(
      (result) => {
        this.menus = result;
      },
      (error) => console.error
    );
  }

  initializeEmployeeRoleForm() {
    this.menuForm = new FormGroup({
      menuId: this.menuId,
      menuName: this.menuName,
      routeUrl: this.routeUrl,
      isActive: this.isActive
    });
  }
  openDeleteModal(content, id) {
    debugger
    this.EventValue = 'Delete';
    this.selectedMenuId = id;
    this.openModal(content);
  }


  Delete() {
    debugger
    this.menuService.DeleteMenu(this.selectedMenuId).subscribe(
      (result) => {
        if (result == null) {
          this.modalService.dismissAll();
          this.toastr.success('Menu deleted successfully.', 'success!');
          this.getMenu();
        } else {
          this.toastr.success('something went wrong.', 'error!');
        }
      },
      (error) => {
        console.log(error.errorMessage);
        this.toastr.error('Cannot delete menu', 'error!');
      }
    );
  }
  open(content) {
    this.isUpdate = false;
    this.resetFrom();
    this.isEdit = false;
    this.menu = null;
    this.openModal(content);
  }

  onSubmit() {
    debugger
    const createForm = this.menuForm.value;
    console.log(createForm);

    if (!this.isEdit) {
      if (this.menuForm.valid) {
        const model = new MenuModel();

        model.menuName = createForm.menuName;
        model.routeUrl = createForm.routeUrl;
        model.isActive = createForm.isActive ? true : false;
        this.menuService.CreateMenu(model).subscribe(
          (res) => {
            this.submitted = true;
            this.toastr.success('Menu Added Successfully.', 'Success!');
            this.modalService.dismissAll();
            this.getMenu();
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

      if (this.menuForm.valid) {

     const model = new MenuModel();

     model.menuName = createForm.menuName;
    model.routeUrl = createForm.routeUrl;
     model.isActive = createForm.isActive;
     model.menuId = this.selectmenu.menuId;
     this.menuService.UpdateMenu(model.menuId, model).subscribe(
        (res) => {
          this.toastr.success('Menu Updated Successfully.', 'Success!');
          this.modalService.dismissAll();
          this.getMenu();
        },
        (error) => {
          this.toastr.error(
            error.error.errorMessage !== undefined
              ? error.error.errorMessage
              : 'menu Update failed',
            'Error!'
          );
        }
      );
    }
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
    this.menuForm.reset();
    this.EventValue = 'Save';
    this.submitted = false;
    this.menu = null;
  }

  EditData(content, menu: any) {
    this.isUpdate = true;
    this.isEdit = true;
    this.selectmenu = menu;
    console.log(menu);
    this.EventValue = 'Update';
    this.menuForm.patchValue({
      menuName: menu.menuName,
      routeUrl: menu.routeUrl,
      menuId: menu.menuId,
      isActive:menu.isActive
    });
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'modal-cfo',
      backdrop: 'static'
    });
  }

  
  
  private openModal(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'modal-cfo',
        backdrop: 'static'
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
