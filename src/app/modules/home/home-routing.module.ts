import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../shared/_guards/auth-guard';
import { HomePageComponent } from './components/home-page/home-page.component';

const routes: Routes = [
    {
      path: '',
      children: [
        {path: '', component: HomePageComponent}
      ]
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }