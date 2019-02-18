import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Message} from '../message';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  sendMessage(message: Message): Observable<any> {
    let url = 'message/send-message';
    return this.http.post(url, JSON.stringify(message),{responseType: 'text'}).pipe(map(data =>{
      return data;
    }));
  }
}
