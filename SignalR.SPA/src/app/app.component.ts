import { ThisReceiver } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalRService } from './signal-r.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'SignalR.SPA';

  constructor(
    public signalRService: SignalRService)
    {}

    ngOnInit(){
      this.signalRService.startConnection();

      // setTimeout(() => {
      //   this.signalRService.askServerListener();
      //   this.signalRService.askServer();
      // }, 2000);
    }

    ngOnDestroy(){
      this.signalRService.hubConnection?.off("askServerResponse");
    }
  }
