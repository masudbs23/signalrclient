import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Credential } from '../models/credential';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  login(credential: Credential) {
      return this.http.post<any>(`account/sign-in`, credential)
          .pipe(map(user => {
              // login successful if there's a jwt token in the response
              if (user && user.access_token) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  localStorage.setItem('access_token', JSON.stringify(user.access_token));
              }

              return user;
          }));
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('access_token');
  }
}
