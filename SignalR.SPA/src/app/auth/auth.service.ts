import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { SignalRService, user } from '../signal-r.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(public signalRService: SignalRService,
    public router: Router)
    {
      let tempPersonId: any = localStorage.getItem("personId");
      if(tempPersonId) {
        if(this.signalRService.hubConnection?.state == HubConnectionState.Connected){
          this.reauthMeListener();
          this.reauthMe(tempPersonId);
        }
        else{
          this.signalRService.ssObs().subscribe((obj:any) => {
            if(obj.type == "HubConnStarted"){
              this.reauthMeListener();
              this.reauthMe(tempPersonId);    
            }
          });
        }
      }
     }

     public isAuthenticated: boolean = false;

     async authMe(person: string, pass:string){
      let personInfo = {userName: person, password: pass};

      await this.signalRService.hubConnection?.invoke("authMe", personInfo)
      .then(() => this.signalRService.toastr.info("Logging in Attempt..."))
      .catch(err => console.log(err));
     }

     authMeListenerSuccess(){
      this.signalRService.hubConnection?.on("authMeResponseSuccess", (user: user) => {
        console.log(user);

        localStorage.setItem("personId", user.id);

        this.signalRService.userData = {...user};
        this.isAuthenticated = true;
        this.signalRService.toastr.success("Login Successful!");
        this.signalRService.router.navigateByUrl("/home");
      });
     }

     authMeListenerFail(){
      this.signalRService.hubConnection?.on("authMeResponseFail", () => {
        this.signalRService.toastr.error("Wrong Credentials!");
      });
     }

     async reauthMe(personId: string){
      await this.signalRService.hubConnection?.invoke("reauthMe", personId)
      .then(() => this.signalRService.toastr.info("Logging in Attempt...."))
      .catch(err => console.log(err));
     }

     reauthMeListener() {
      this.signalRService.hubConnection?.on("reauthMeResponse", (user: user) => {
        console.log(user);
        this.signalRService.userData = {...user};
        this.isAuthenticated = true;
        this.signalRService.toastr.success("Re-authenticated");
        if(this.signalRService.router.url == "/auth") this.signalRService.router.navigateByUrl("/home");
      });
     }
}
