import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        console.log('url: ', request.url);
        let token = JSON.parse(localStorage.getItem('access_token'));
        request = request.clone({url: "http://localhost:38434/api/" + request.url})
        if (token) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${token}`,
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                }                
            });
        }

        return next.handle(request);
    }
}
