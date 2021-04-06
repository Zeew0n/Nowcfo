import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-minichild',
  templateUrl: './minichild.component.html',
  styleUrls: ['./minichild.component.scss']
})
export class MiniChildComponent implements OnInit {

employeeorgpermissions: string[] =[];
employeeId=null;

@Input() fields;
@Input() showCheckBox;

@Output() onChecked = new EventEmitter<Array<any>>();
private treeElement: TreeViewComponent;
  @ViewChild('treeview') set content(tree: TreeViewComponent) {
    if(tree) {
        this.treeElement = tree;
        this.treeElement.checkedNodes = this.fields.dataSource.filter(x=>x.isChecked).map(x=>x.id);
        //this.treeElement.checkedNodes= ['2','3'];
       
        this.employeeService.previewdata.subscribe(message => this.employeeId = message);
        
        this.getCheckedPermission(this.employeeId);

        this.treeElement.checkedNodes=this.employeeorgpermissions;
    }


 }

 constructor(  private employeeService: EmployeeService,) { 
 }




  ngOnInit(): void {

    this.employeeService.previewdata.subscribe(message => this.employeeId = message);
  }


  getCheckedPermission(employeeId) {
    debugger;
     this.employeeService.getCheckedPermission(employeeId).subscribe(
       (result) => {
         result.forEach(element => {
           this.employeeorgpermissions.push(element.orgId);
           console.log(this.employeeorgpermissions);
         });
       },
       (error) => console.error
     );
   }


  public nodeChecked(args): void{
    
    this.onChecked.emit(this.treeElement.checkedNodes);
    alert(this.treeElement.checkedNodes)
  }
}
