import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/customer/home/home.component';
import { UserComponent } from './components/customer/user/user.component';
import { RegisterComponent } from './components/register/register.component';
import { FavoritesComponent } from './components/customer/favorites/favorites.component';
import { LoginComponent } from './components/login/login.component';
import { VendorHomeComponent } from './components/vendor/vendor-home/vendor-home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component:LoginComponent
  },
  {
      path: 'home', 
      component:HomeComponent        
  },
  {
    path: 'user',
    component:UserComponent
  },
  {
    path: 'register',
    component:RegisterComponent
  },
  {
    path: 'favorites',
    component:FavoritesComponent
  },
  {
    path: 'vendors/:id/home',
    component:VendorHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
 }
