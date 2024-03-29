import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Location } from 'src/entities/location';
import { Menu } from 'src/entities/menu';
import { MenuItem } from 'src/entities/menuItem';
import { ResponseMetaData } from 'src/entities/metadata';
import { Payload } from 'src/entities/payload';
import { Tag } from 'src/entities/tag';
import { Vendor } from 'src/entities/vendor';
import { HandleError, HttpErrorHandler } from './http-error-handler.service';

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

  private metaData: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public meta$ = this.metaData.asObservable();

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
        .subscribe((payload: Payload) => {
          this.vendorData.next(payload.data);
          this.metaData.next(payload._meta);
        });
    }
  }

  public getFavoriteVendors() {
    this.httpClient.get('http://localhost:8888/vendors/favorites')
    .subscribe((payload: Payload) => {
      this.vendorData.next(payload.data);
      this.metaData.next(payload._meta);
    });
  }

  public getVendorsNextPage(uri: string) {
    this.httpClient.get('http://localhost:8888' + uri)
        .subscribe((payload) => { this.vendorData.next(payload); });
  }

  public fetchLocationForVendor(vendor: Vendor) {
    this.httpClient.get<Location>('http://ip-api.com/json')
    .subscribe((payload) => {
      vendor.latitude = payload.lat;
      vendor.longitude = payload.lon;
      this.updateVendor(vendor).subscribe((payload) => {})
    });
  }

  public getVendor(id: string): Observable<Vendor> {
    return this.httpClient.get<Vendor>('http://localhost:8888/vendors/' + id);
  }

  public getVendorSub(id: number) {
    this.httpClient.get<Vendor>('http://localhost:8888/vendors/' + id)
      .subscribe((payload) => {this.vendorData.next(payload)});
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

  public updateVendor(vendor: Vendor): Observable<Vendor> {
    return this.httpClient.put<Vendor>('http://localhost:8888/vendors/' + vendor.id, JSON.stringify(vendor), header);
  }

  public updateVendorForSub(vendor: Vendor) {
    this.httpClient.put<Vendor>('http://localhost:8888/vendors/' + vendor.id, JSON.stringify(vendor), header)
      .subscribe((payload) => this.vendorData.next(payload));
  }

  public getAllTags(): Observable<Payload> {
    return this.httpClient.get<Payload>('http://localhost:8888/vendors/tags');
  }

  public getAllTagsByName(name: string): Observable<Payload> {
    return this.httpClient.get<Payload>('http://localhost:8888/vendors/tags?name=' + name);
  }

  public getTagsForPage(query: string): Observable<Payload> {
    return this.httpClient.get<Payload>('http://localhost:8888' + query);
  }

  public getMenus(id: number): Observable<Array<Menu>> {
    return this.httpClient.get<Array<Menu>>('http://localhost:8892/vendors/' + id + "/menus");
  }

  public getMenusForSub(id: number) {
    this.httpClient.get<Array<Menu>>('http://localhost:8892/vendors/' + id + "/menus")
      .subscribe((payload) => this.MenuData.next(payload));
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
