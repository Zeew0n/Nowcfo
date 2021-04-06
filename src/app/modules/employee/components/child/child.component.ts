import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss']
})
export class ChildComponent implements OnInit {




@Input() fields;
@Input() showCheckBox;
@Output() onChecked = new EventEmitter<Array<any>>();
private treeElement: TreeViewComponent;
  @ViewChild('treeview') set content(tree: TreeViewComponent) {
    if(tree) {
        this.treeElement = tree;
    }
 }

 constructor() { }

  ngOnInit(): void {
  }

  public nodeChecked(args): void{
    this.onChecked.emit(this.treeElement.checkedNodes);
  }
}
