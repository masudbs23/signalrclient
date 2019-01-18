import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Message } from './message';
import { HttpClient, HttpHeaders } from "@angular/common/http";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public _hubConnection: HubConnection;
  public notification: string = 'notification';
  public messages: Message[] = [];
  public msg: string;
  public isLoggedIn: boolean = false;
  public name: string;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this._hubConnection = new HubConnectionBuilder().withUrl("http://localhost:38434/notify").build();

    this.start();

  }
  async start() {
    try {
      await this._hubConnection.start();
      console.log('connected');
      this.receiveNotification();
      this.receiveMessage();
    } catch (err) {
      console.log(err);
      setTimeout(() => this.start(), 5000);
    }
  }
  receiveMessage(): any {
    this._hubConnection.on('BroadcastMessage', (payload: string) => {
      this.notification = payload;
    });
  }


  private receiveNotification() {
    this._hubConnection.on('SendMessage', (sender: string, payload: string) => {
      let message: Message = new Message();
      message.payload = payload;
      message.sender = sender;
      this.messages.push(message);
    });
  }

  sendMessage(event): void {
    if (event.key === "Enter" && (this.msg || this.name)) {
      if (this.name) {
        this.isLoggedIn = true;
      }
      if (this.msg) {
        let message: Message = new Message();
        message.payload = this.msg;
        message.sender = this.name;
        const httpOptions = {
          headers: new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          })
        };
        let url = 'http://localhost:38434/api/message/send-message';
        this.http.post(url, JSON.stringify(message), httpOptions).subscribe(res => {
          console.log(res);
        });

        this.msg = '';
      }
    }
  }
}
