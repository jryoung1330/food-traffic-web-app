import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from 'src/entities/user';
import { HandleError, HttpErrorHandler } from './http-error-handler.service';

const header = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'observe': 'response',
  }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userData: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public user$: Observable<User> = this.userData.asObservable();
  private handleError: HandleError;

  constructor(private httpClient: HttpClient, httpErrorHandler: HttpErrorHandler) { 
    this.handleError = httpErrorHandler.createHandleError('UserService');
  }

  public loginUser(user: User, credentials: string): Observable<User> {
    header.headers = header.headers.set('Authorization', 'Basic ' + credentials);
    this.httpClient.post<User>('http://localhost:8889/users/login', JSON.stringify(user), header)
      .pipe(catchError(this.handleError('loginUser', null)))
      .subscribe((payload) => { this.userData.next(payload); });
    return this.user$;
  }

  public postNewUser(user: User, credentials: string): Observable<User> {
    header.headers = header.headers.set('Authorization', 'Basic ' + credentials);
    user.passwordHash = '';
    return this.httpClient.post<User>('http://localhost:8889/users', JSON.stringify(user), header)
      .pipe(catchError(this.handleError('addUser', user)));
  }

  public getUserByToken(): Observable<User> {
    return this.httpClient.post<User>('http://localhost:8889/users/token', null, header);
  }

  public getUser(): Observable<User> {
    return this.httpClient.get<User>('http://localhost:8889/users/token');
  }

  public logoutUser(userId: string, router: Router): Observable<User> {
    this.userData.next(null);
    return this.httpClient.post<User>('http://localhost:8889/users/' + userId + '/logout', null, header);
  }

}
