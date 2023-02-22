import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';

export class user{
  public id: any;
  public name: any;
  public connId: any;
}


@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  constructor(public toastr: ToastrService,
    public router:Router
    ) { }

  // constructor(public toastr: ToastrService) { }


  hubConnection: signalR.HubConnection | undefined;
  userData: any;

  ssSubj = new Subject<any>();
  ssObs(): Observable<any>{
    return this.ssSubj.asObservable();
  }
   
  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:7242/toaster', {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    })
    .build();

    this.hubConnection
    .start()
    .then(() => {
      this.ssSubj.next({type:"HubConnection"});
    //   console.log('Hub Connection Started!');
      // console.log("HubConnectionStart");
      // this.askServerListener();
      // this.askServer();
     })
    .catch(err => console.log('Error while starting connection: ' + err))
  }

  async askServer() {
    console.log("AskServerStart");
    await this.hubConnection?.invoke("askServer", "hi")
      .then(() => {
        console.log("AskServerThen");
      })
      .catch(err => console.error(err));      

      console.log("This is the final prompt");
  }

  askServerListener() {
    console.log("AskServerListenerStart");

    this.hubConnection?.on("askServerResponse", (someText) => {
      console.log("askServer.Listener");
      console.log(someText);
      this.toastr.success(someText);
    })
  }
}
