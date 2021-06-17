import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { VendorCardComponent } from './components/vendor-card/vendor-card.component';
import { UserComponent } from './components/user/user.component';
import { RegisterComponent } from './components/register/register.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { LoginComponent } from './components/login/login.component';
import { VendorTagComponent } from './components/vendor-tag/vendor-tag.component';
import { HttpErrorHandler } from './services/http-error-handler.service';
import { MessageService } from './services/message.service';
import { VendorTagCardComponent } from './components/vendor-tag-card/vendor-tag-card.component';
import { VendorOperationsComponent } from './components/vendor-operations/vendor-operations.component';
import { VendorMenuComponent } from './components/vendor-menu/vendor-menu.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';

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
    MenuItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    HttpErrorHandler,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
