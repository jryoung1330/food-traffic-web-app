import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/customer/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { VendorCardComponent } from './components/customer/vendor-card/vendor-card.component';
import { UserComponent } from './components/customer/user/user.component';
import { RegisterComponent } from './components/register/register.component';
import { FavoritesComponent } from './components/customer/favorites/favorites.component';
import { LoginComponent } from './components/login/login.component';
import { VendorTagComponent } from './components/customer/vendor-tag/vendor-tag.component';
import { HttpErrorHandler } from './services/http-error-handler.service';
import { MessageService } from './services/message.service';
import { VendorTagCardComponent } from './components/customer/vendor-tag-card/vendor-tag-card.component';
import { VendorOperationsComponent } from './components/customer/vendor-operations/vendor-operations.component';
import { VendorMenuComponent } from './components/customer/vendor-menu/vendor-menu.component';
import { MenuItemComponent } from './components/vendor/menu/menu-item/menu-item.component';
import { VendorHomeComponent } from './components/vendor/home/vendor-home.component';
import { VendorProfileComponent } from './components/vendor/profile/profile.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MenuComponent } from './components/vendor/menu/menu.component';
import { VendorMenuItemComponent } from './components/customer/vendor-menu/vendor-menu-item/vendor-menu-item.component';
import { OperationEditDialog, OperationsComponent } from './components/vendor/operations/operations.component';
import { LandingComponent } from './components/landing/landing.component';
import { ConfirmationDialog } from './components/confirmation/confirmation.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MenuDialog } from './components/vendor/menu/menu-dialog/menu-dialog.component';
import { MenuItemDialog } from './components/vendor/menu/menu-item/menu-item-dialog/menu-item-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    VendorCardComponent,
    UserComponent,
    RegisterComponent,
    FavoritesComponent,
    LoginComponent,
    VendorTagComponent,
    VendorTagCardComponent,
    VendorOperationsComponent,
    VendorMenuComponent,
    MenuItemComponent,
    VendorHomeComponent,
    VendorProfileComponent,
    OperationEditDialog,
    MenuItemDialog,
    MenuComponent,
    MenuDialog,
    VendorMenuItemComponent,
    OperationsComponent,
    LandingComponent,
    ConfirmationDialog,
    MenuDialog,
    MenuItemDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    DragDropModule
  ],
  providers: [
    HttpErrorHandler,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
