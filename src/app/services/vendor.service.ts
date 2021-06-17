import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { User } from 'src/entity/user';
import { Vendor } from 'src/entity/vendor';
import { HandleError, HttpErrorHandler } from './http-error-handler.service';
import { Tag } from 'src/entity/tag';
import { Operation } from 'src/entity/operation';
import { Menu } from 'src/entity/menu';

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

export class HttpService {
  private locationData: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public location$ = this.locationData.asObservable();

  private vendorData: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public vendor$ = this.vendorData.asObservable();

  private handleError: HandleError;

  constructor(private httpClient: HttpClient, httpErrorHandler: HttpErrorHandler) { 
    this.handleError = httpErrorHandler.createHandleError('VendorService');
  }

  public fetchLocation() {
    this.httpClient.get('http://ip-api.com/json')
      .subscribe((payload) => {
        this.locationData.next(payload);
        this.fetchVendorsByLocation(payload['city'], payload['region']);
      });
  }

  public fetchVendorsByLocation(city: string, state: string) {
    if (city != null && state != null) {
      this.httpClient.get('http://localhost:8888/vendors?city=' + city + '&state=' + state)
        .subscribe((payload) => { this.vendorData.next(payload); });
    }
  }

  public createVendor(vendor: Vendor): Observable<Vendor> {
    if(vendor != null) {
      return this.httpClient.post<Vendor>('http://localhost:8888/vendors', JSON.stringify(vendor), header)
        .pipe(catchError(this.handleError));
        // .subscribe((payload) => { this.vendorData.next(payload);});
    } else {
      return null;
    }
  }

  public getAllTags(): Observable<Array<Tag>> {
    return this.httpClient.get<Array<Tag>>('http://localhost:8888/tags');
  }

  public getHoursOfOperation(id: number): Observable<Operation> {
    return this.httpClient.get<Operation>('http://localhost:8888/vendors/' + id + "/operations?search=3-day");
  }

  public getMenus(id: number): Observable<Array<Menu>> {
    return this.httpClient.get<Array<Menu>>('http://localhost:8888/vendors/' + id + "/menus");
  }
}
