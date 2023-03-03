import { Component, OnInit } from '@angular/core';
import { HubConnectionState } from '@microsoft/signalr';
import { Message, SignalRService, user } from '../signal-r.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public signalRService: SignalRService) { }

  Users: Array<user> = new Array<user>();
  selectedUser: user | undefined;
  msg: string = "";

  ngOnInit(): void {
    this.userOnLis();
    this.userOfLis();
    this.logOutLis();
    this.getOnlineUsersLis();
    this.sendMsgLis();

    if(this.signalRService.hubConnection?.state == HubConnectionState.Connected) this.getOnlineUserInv()
    else {
      this.signalRService.ssSubj.subscribe((obj:any) => {
        if(obj.type =="HubConnStarted"){
          this.getOnlineUserInv();
        }
      });
    }
  }

  sendMsgInv(): void {
    if(this.msg?.trim() == "" || this.msg == null) return;
    this.signalRService.hubConnection?.invoke("sendMsg", this.selectedUser?.connId, this.msg)
    .catch(err => console.error(err));

    if(this.selectedUser?.msgs == null)
    {
      this.selectedUser!.msgs = [];
    }

    this.selectedUser?.msgs.push(new Message(this.msg, true));
    this.msg = "";
  }

  private sendMsgLis() : void {
    this.signalRService.hubConnection?.on("sendMsgResponse", (connId: string, msg: string) => {
      console.log("sendMsgLis 1");
      let receiver = this.Users.find(u => u.connId == connId);
      if(receiver?.msgs == null) receiver!.msgs = [];
      receiver?.msgs.push(new Message(msg, false));
      console.log("sendMsgLis end");
    });
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
