import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { CustomerHomeComponent } from './components/customer/home/customer-home.component';
import { UserComponent } from './components/customer/user/user.component';
import { LandingComponent } from './components/landing/landing.component';
import { RegisterComponent } from './components/register/register.component';
import { VendorHomeComponent } from './components/vendor/home/vendor-home.component';
import { VendorProfileComponent } from './components/vendor/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'home', 
    component: CustomerHomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    component:RegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vendors/home',
    component: VendorHomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vendors/:id',
    component: VendorProfileComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
 }
