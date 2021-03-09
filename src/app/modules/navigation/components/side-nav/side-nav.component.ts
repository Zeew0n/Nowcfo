import { Component} from '@angular/core';
import { OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { OrganizationNavModel } from 'src/app/models/OrganizationNavModel';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./sidebar.scss'],
})
export class SideNavComponent implements OnInit {
  constructor(
    private navigationService: NavigationService
  ) {}

  expandOrgNav = false;

  menus = ['org manager', 'org roles', 'employee management'];

  admins = ['admin', 'users', 'portal settings'];

  organizations: OrganizationNavModel[];
  items: TreeviewItem[] = [];

  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 400
  });

  ngOnInit() {}

  toggleOrganizationNav() {
    this.expandOrgNav = !this.expandOrgNav;
    this.NavigateOrganization();
  }

  NavigateOrganization(index = 0) {
    this.getOrganizatioNavigation();
  }

  getOrganizatioNavigation() {
    this.navigationService.getOrganizationNavigation().subscribe(
      (res: TreeviewItem[]) => {
        this.items.length = 0;
        res.forEach((data) => {
          const item = new TreeviewItem({
            text: data.text,
            value: data.value,
            collapsed: true,
            children: data.children,
          });
          this.items.push(item);
          console.log('Data', this.items);
        });
      },
      (error) => console.error(error)
    );
  }

  onValueChange(e) {
    const data = this.items.find((x) => x.value === e);
    if (data) {
      this.items.find((x) => x.value === e).collapsed = !data.collapsed;
      console.log(e);
    }
  }
}
