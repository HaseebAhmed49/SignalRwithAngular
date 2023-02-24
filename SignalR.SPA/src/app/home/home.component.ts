import { Component, OnInit } from '@angular/core';
import { HubConnectionState } from '@microsoft/signalr';
import { SignalRService, user } from '../signal-r.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public signalRService: SignalRService) { }

  Users: Array<user> = new Array<user>();
  selectedUser: user | any;
  msg: string = "";

  ngOnInit(): void {
    this.userOnLis();
    this.userOfLis();
    this.logOutLis();
    this.getOnlineUsersLis();

    if(this.signalRService.hubConnection?.state == HubConnectionState.Connected) this.getOnlineUserInv()
    else {
      this.signalRService.ssSubj.subscribe((obj:any) => {
        if(obj.type =="HubConnStarted"){
          this.getOnlineUserInv();
        }
      });
    }
  }

  logOut(): void {
    this.signalRService.hubConnection?.invoke("logOut", this.signalRService.userData.id)
    .catch(err => console.error(err));
  }

  logOutLis(): void {
    this.signalRService.hubConnection?.on("logoutResponse", () => {
      localStorage.removeItem("personId");
      location.reload();
    })
  }

  userOnLis(): void {
    this.signalRService.hubConnection?.on("userOn", (newUser: user)=> {
      console.log(newUser);
      this.Users.push(newUser);
    });
  }

  userOfLis(): void {
    this.signalRService.hubConnection?.on("userOff", (personId: string) => {
      this.Users = this.Users.filter(u => u.id != personId);
    });
  }

  getOnlineUserInv(): void {
    this.signalRService.hubConnection?.invoke("getOnlineUsers")
    .catch(err => console.error(err));
  }

  getOnlineUsersLis(): void {
    this.signalRService.hubConnection?.on("getOnlineUserResponse", (onlineUser: Array<user>) => {
      this.Users = [...onlineUser]
    });
  }
}
