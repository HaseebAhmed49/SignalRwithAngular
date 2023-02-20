import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';


@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  constructor() { }

  // constructor(public toastr: ToastrService) { }


  hubConnection: signalR.HubConnection | undefined;
   
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
    //   console.log('Hub Connection Started!');
      console.log("HubConnectionStart");
      this.askServerListener();
      this.askServer();
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
      // this.toastr.success(someText);
    })
  }
}
