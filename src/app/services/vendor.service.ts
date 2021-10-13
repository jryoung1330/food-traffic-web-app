import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { User } from 'src/entities/user';
import { Vendor } from 'src/entities/vendor';
import { HandleError, HttpErrorHandler } from './http-error-handler.service';
import { Tag } from 'src/entities/tag';
import { Operation } from 'src/entities/operation';
import { Menu } from 'src/entities/menu';
import { OperationItem } from 'src/entities/operationItem';
import { MenuItem } from 'src/entities/menuItem';

const header = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'observe': 'response'
  }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})

export class VendorService {
  private locationData: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public location$ = this.locationData.asObservable();

  private vendorData: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public vendor$ = this.vendorData.asObservable();

  private MenuData: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public menu$ = this.MenuData.asObservable();

  private handleError: HandleError;

  constructor(private httpClient: HttpClient, httpErrorHandler: HttpErrorHandler) { 
    this.handleError = httpErrorHandler.createHandleError('VendorService');
  }

  public fetchLocation() {
    this.httpClient.get('http://ip-api.com/json')
      .subscribe((payload) => {
        this.locationData.next(payload);
        this.getVendorsByLocation(payload['city'], payload['region']);
      });
  }

  public getVendorsByLocation(city: string, state: string) {
    if (city != null && state != null) {
      this.httpClient.get('http://localhost:8888/vendors?city=' + city + '&state=' + state)
        .subscribe((payload) => { this.vendorData.next(payload); });
    }
  }

  public getVendor(id: string): Observable<Vendor> {
    return this.httpClient.get<Vendor>('http://localhost:8888/vendors/' + id, header);
  }

  public createVendor(vendor: Vendor): Observable<Vendor> {
    if(vendor != null) {
      return this.httpClient.post<Vendor>('http://localhost:8888/vendors', JSON.stringify(vendor), header);
        // .subscribe((payload) => { this.vendorData.next(payload);});
        // .pipe(catchError(this.handleError));
    } else {
      return null;
    }
  }

  public getAllTags(): Observable<Array<Tag>> {
    return this.httpClient.get<Array<Tag>>('http://localhost:8888/tags');
  }

  public getHoursOfOperation(id: number, searchKey: string): Observable<OperationItem[]> {
    return this.httpClient.get<OperationItem[]>('http://localhost:8888/vendors/' + id + "/operations?search=" + searchKey);
  }

  public getMenus(id: number): Observable<Array<Menu>> {
    return this.httpClient.get<Array<Menu>>('http://localhost:8892/vendors/' + id + "/menus");
  }

  public getMenusForSub(id: number) {
    this.httpClient.get<Array<Menu>>('http://localhost:8892/vendors/' + id + "/menus")
      .subscribe((payload) => this.MenuData.next(payload));
  }

  public updateOperationItem(path: string, operationItem: OperationItem): Observable<OperationItem> {
    return this.httpClient.put<OperationItem>('http://localhost:8888' + path + "/operations/" + operationItem.operationId + "/operation-items/" + operationItem.id, 
      JSON.stringify(operationItem), header);
  }

  public createEvent(path: string, operationItem: OperationItem): Observable<OperationItem> {
    return this.httpClient.post<OperationItem>('http://localhost:8888' + path + '/operations/' + operationItem.operationId + "/operation-items", JSON.stringify(operationItem), header)
  }

  public createMenu(path: string, menu: Menu) {
    return this.httpClient.post<Menu>('http://localhost:8892' + path + '/menus', JSON.stringify(menu), header);
  }

  public updateMenu(path: string, menu: Menu): Observable<Menu> {
    return this.httpClient.put<Menu>('http://localhost:8892' + path + '/menus/' + menu.id, JSON.stringify(menu), header);
  }

  public deleteMenu(path: string, menu: Menu): Observable<Menu> {
    return this.httpClient.delete<Menu>('http://localhost:8892' + path + '/menus/' + menu.id, header);
  }

  public createMenuItem(path: string, menuItem: MenuItem): Observable<MenuItem> {
    return this.httpClient.post<MenuItem>('http://localhost:8892' + path + '/menus/' + menuItem.menuId + '/menu-items', JSON.stringify(menuItem), header);
  }

  public updateMenuItem(path: string, menuItem: MenuItem): Observable<MenuItem> {
    return this.httpClient.put<MenuItem>('http://localhost:8892' + path + '/menus/' + menuItem.menuId + '/menu-items/' + menuItem.id, JSON.stringify(menuItem), header);
  }

  public deleteMenuItem(path: string, menuItem: MenuItem): Observable<MenuItem> {
    return this.httpClient.delete<MenuItem>('http://localhost:8892' + path + '/menus/' + menuItem.menuId + '/menu-items/' + menuItem.id, header);
  }

  public getTopMenuItems(id: number): Observable<Array<MenuItem>> {
    return this.httpClient.get<Array<MenuItem>>('http://localhost:8892/vendors/' + id + '/menus/menu-items/top-sellers');
  }

}
